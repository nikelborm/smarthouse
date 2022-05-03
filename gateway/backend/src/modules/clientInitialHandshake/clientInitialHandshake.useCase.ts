import { Injectable } from '@nestjs/common';
import {
  InitHandshakeQuery,
  InitHandshakeResponse,
  RequestedEvent,
  RequestedEventParameter,
  validate,
} from 'src/types';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { model, repo } from '../infrastructure';
import { EncryptionUseCase } from '../encryption';
import {
  assertThereAreNoDuplicateUUIDs,
  differenceBetweenSetsInArray,
  doesArraysIntersects,
  remapToIndexedObject,
} from 'src/tools';
import { DataValidatorUseCase } from '../dataValidator';

@Injectable()
export class ClientInitialHandshakeUseCase {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventRepo: repo.EventRepo,
    private readonly encryptionUseCase: EncryptionUseCase, // needed for all encryption workers be ready at this moment
    private readonly dataValidatorUseCase: DataValidatorUseCase, // needed for all data validators be ready at this moment
    private readonly clientRepo: repo.ClientRepo,
    private readonly eventParameterRepo: repo.EventParameterRepo,
    private readonly endpointRepo: repo.EndpointRepo,
    private readonly parameterToEventAssociationRepo: repo.ParameterToEventAssociationRepo,
  ) {}

  async init(handshakeRequest: InitHandshakeQuery) {
    return await this.entityManager.transaction(async (transactionManager) => {
      return await this.executeClientHandshake(
        transactionManager,
        handshakeRequest,
      );
    });
  }

  private async executeClientHandshake(
    transactionManager: EntityManager,
    handshakeRequest: InitHandshakeQuery,
  ): Promise<InitHandshakeResponse> {
    await this.validateHandshakeRequest(handshakeRequest);

    const encryptionWorker = this.encryptionUseCase.getEncryptionWorker(
      handshakeRequest.encryptionWorkerUUID,
    );

    const { eventUUIDToIdMap } = await this.registerOnlyNewEventsAndParameters(
      transactionManager,
      handshakeRequest.supported.eventParameters,
      handshakeRequest.supported.events,
    );

    const { credentialsToStoreInDatabase, credentialsToSendBackToClient } =
      await encryptionWorker.getServerSideHandshakeCredentials(
        handshakeRequest.encryptionWorkerCredentials,
      );

    const { id: registeredClientId } =
      await this.clientRepo.createOneInTransactionWithRelations(
        {
          uuid: handshakeRequest.uuid,
          shortname: handshakeRequest.shortname,
          fullname: handshakeRequest.fullname,
          description: handshakeRequest.description,
          encryptionWorkerUUID: handshakeRequest.encryptionWorkerUUID,
          encryptionWorkerCredentials: credentialsToStoreInDatabase,
        },
        transactionManager,
      );

    await this.endpointRepo.createManyPlainInTransaction(
      handshakeRequest.supported.routeEndpoints.map(
        ({ eventUUID, ...rest }) => ({
          ...rest,
          clientId: registeredClientId,
          ...(eventUUID && { eventId: eventUUIDToIdMap[eventUUID] }),
        }),
      ),
      transactionManager,
    );

    return {
      registeredClientId: 123,
      wifi: {
        BSSID: '00:00:5e:00:53:af',
        password: 'shit',
      },
      gateway: {
        HTTPAdress: 'https://asd.ri',
        uuid: '234',
        WSAdress: 'ws://123.234.345.456/socket',
        encryptionModuleCredentials: credentialsToSendBackToClient,
      },
    };
  }

  private async registerOnlyNewEventsAndParameters(
    transactionManager: EntityManager,
    supportedEventParameters: RequestedEventParameter[],
    supportedEvents: RequestedEvent[],
  ) {
    const eventParametersUUIDs = supportedEventParameters.map(
      ({ uuid }) => uuid,
    );

    const eventsUUIDs = supportedEvents.map(({ uuid }) => uuid);

    try {
      await this.eventParameterRepo.insertInTransactionOnlyNewEventParameters(
        supportedEventParameters,
        transactionManager,
      );
    } catch (error) {
      throw new Error(
        'Some of your required data validators does not implemented',
      );
    }

    const eventsToInsert = supportedEvents.map(
      ({ uuid, name, description, type, hexColor }) => ({
        uuid,
        name,
        description,
        type,
        hexColor,
      }),
    );

    const newlyInsertedEventIds = new Set(
      (
        await this.eventRepo.insertInTransactionOnlyNewEvents(
          eventsToInsert,
          transactionManager,
        )
      ).generatedMaps.map(({ id }) => id),
    );

    const eventUUIDToIdMap = remapToIndexedObject(
      await this.eventRepo.getInTransactionWithIdsBy(
        eventsUUIDs,
        transactionManager,
      ),
      ({ uuid }) => uuid,
      ({ id }) => id,
    );

    const eventParameterUUIDToId = remapToIndexedObject(
      await this.eventParameterRepo.getInTransactionWithIdsBy(
        eventParametersUUIDs,
        transactionManager,
      ),
      ({ uuid }) => uuid,
      ({ id }) => id,
    );

    const eventToParameterAssociationsToInsert = supportedEvents.flatMap(
      ({ optionalParameterUUIDs, requiredParameterUUIDs, uuid: eventUUID }) => [
        ...optionalParameterUUIDs.map((eventParameterUUID) => ({
          eventId: eventUUIDToIdMap[eventUUID],
          eventParameterId: eventParameterUUIDToId[eventParameterUUID],
          isParameterRequired: false,
        })),
        ...requiredParameterUUIDs.map((eventParameterUUID) => ({
          eventId: eventUUIDToIdMap[eventUUID],
          eventParameterId: eventParameterUUIDToId[eventParameterUUID],
          isParameterRequired: true,
        })),
      ],
    );

    const parameterToEventAssociationOnlyFromNewEvents =
      eventToParameterAssociationsToInsert.filter(({ eventId }) =>
        newlyInsertedEventIds.has(eventId),
      );

    await this.parameterToEventAssociationRepo.createManyPlainInTransaction(
      parameterToEventAssociationOnlyFromNewEvents,
      transactionManager,
    );

    return {
      eventUUIDToIdMap,
      eventParameterUUIDToId,
    };
  }

  private async validateHandshakeRequest(
    initHandshakeQuery: InitHandshakeQuery,
  ) {
    const {
      supported: { eventParameters, events, routeEndpoints, transport },
      encryptionWorkerCredentials,
      encryptionWorkerUUID,
    } = initHandshakeQuery;

    const validationErrors = validate(initHandshakeQuery, InitHandshakeQuery);
    if (validationErrors.length)
      throw new Error('InitHandshakeQuery: validation error');

    // check if worker is existing
    const encryptionWorker =
      this.encryptionUseCase.getEncryptionWorker(encryptionWorkerUUID);

    // check if all validators are existing
    for (const { dataValidatorUUID } of initHandshakeQuery.supported
      .eventParameters) {
      this.dataValidatorUseCase.getValidator(dataValidatorUUID);
    }

    if (
      !(await encryptionWorker.isClientSideHandshakeCredentialsValid(
        encryptionWorkerCredentials,
      ))
    )
      throw new Error('You have sent bad credentials');

    assertThereAreNoDuplicateUUIDs(eventParameters, 'event parameter');
    assertThereAreNoDuplicateUUIDs(events, 'event');
    assertThereAreNoDuplicateUUIDs(routeEndpoints, 'route endpoint');
    // this.areThereDuplicateUUIDs(
    //   [...routeEndpoints, ...events, ...eventParameters],
    //   'su',
    // );

    for (const { optionalParameterUUIDs, requiredParameterUUIDs } of events) {
      if (doesArraysIntersects(optionalParameterUUIDs, requiredParameterUUIDs))
        throw new Error(
          'Some of your events have one parameter in both required and optional parameters',
        );
    }

    const parameterUUIDsRequestedByEvents = new Set(
      events.flatMap((event) => [
        ...event.optionalParameterUUIDs,
        ...event.requiredParameterUUIDs,
      ]),
    );

    const grantedParameterUUIDs = eventParameters.map(({ uuid }) => uuid);

    const unknownParametersUUIDsRequestedByEvents =
      differenceBetweenSetsInArray(
        parameterUUIDsRequestedByEvents,
        new Set(grantedParameterUUIDs),
      );

    if (unknownParametersUUIDsRequestedByEvents.length)
      throw new Error(
        'Some events mentions parameters that does not exists in your supported parameters list',
      );

    const eventUUIDsRequestedByEndpoints = new Set(
      routeEndpoints.map(({ eventUUID }) => eventUUID),
    );

    const grantedEventUUIDs = events.map(({ uuid }) => uuid);

    const unknownEventsUUIDsRequestedByEndpoints = differenceBetweenSetsInArray(
      eventUUIDsRequestedByEndpoints,
      new Set(grantedEventUUIDs),
    );

    if (unknownEventsUUIDsRequestedByEndpoints.length)
      throw new Error(
        'Some events mentions parameters that does not exists in your supported parameters list',
      );

    if (!transport.http && !transport.wss)
      throw new Error('You need to support at least 1 transport');
  }
}
