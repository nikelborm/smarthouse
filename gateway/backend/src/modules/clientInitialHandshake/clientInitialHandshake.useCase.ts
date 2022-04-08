import { Injectable } from '@nestjs/common';
import { InitHandshakeQuery, InitHandshakeResponse, validate } from 'src/types';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { model, repo } from '../infrastructure';
import { EncryptionUseCase } from '../encryption';
import {
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

  async executeClientHandshake(
    transactionManager: EntityManager,
    handshakeRequest: InitHandshakeQuery,
  ): Promise<InitHandshakeResponse> {
    await this.validateHandshakeRequest(handshakeRequest);

    const encryptionWorker = this.encryptionUseCase.getEncryptionWorker(
      handshakeRequest.encryptionWorkerUUID,
    );

    const evenParametersUUIDs = handshakeRequest.supported.eventParameters.map(
      ({ uuid }) => uuid,
    );

    try {
      await this.eventParameterRepo.insertInTransactionOnlyNewEventParameters(
        handshakeRequest.supported.eventParameters,
        transactionManager,
      );
    } catch (error) {
      throw new Error(
        'Some of your required data validators does not implemented',
      );
    }

    const eventToParameterAssociationsToInsert: {
      eventParameterUUID: string;
      eventUUID: string;
      isParameterRequired: boolean;
    }[] = [];
    const eventsToInsert: Partial<model.Event>[] = [];

    for (const {
      optionalParameterUUIDs,
      requiredParameterUUIDs,
      ...event
    } of handshakeRequest.supported.events) {
      eventToParameterAssociationsToInsert.push(
        ...optionalParameterUUIDs.map((uuid) => ({
          eventParameterUUID: uuid,
          eventUUID: event.uuid,
          isParameterRequired: false,
        })),
        ...requiredParameterUUIDs.map((uuid) => ({
          eventParameterUUID: uuid,
          eventUUID: event.uuid,
          isParameterRequired: true,
        })),
      );
      eventsToInsert.push(event);
    }

    const eventsToInsertUUIDs = eventsToInsert.map(({ uuid }) => uuid);

    const newlyInsertedEventUUIDs = new Set(
      (
        await this.eventRepo.insertInTransactionOnlyNewEvents(
          eventsToInsert,
          transactionManager,
        )
      ).generatedMaps.map(({ uuid }) => uuid),
    );

    const indexedEvents = remapToIndexedObject(
      await this.eventRepo.getInTransactionWithIdsBy(
        eventsToInsertUUIDs,
        transactionManager,
      ),
      ({ uuid }) => uuid,
    );

    const indexedEventParameters = remapToIndexedObject(
      await this.eventParameterRepo.getInTransactionWithIdsBy(
        evenParametersUUIDs,
        transactionManager,
      ),
      ({ uuid }) => uuid,
    );

    const parameterToEventAssociationOnlyFromNewEvents =
      eventToParameterAssociationsToInsert
        .filter(({ eventUUID }) => newlyInsertedEventUUIDs.has(eventUUID))
        .map(({ eventParameterUUID, eventUUID, isParameterRequired }) => ({
          eventId: indexedEvents[eventUUID].id,
          eventParameterId: indexedEventParameters[eventParameterUUID].id,
          isParameterRequired,
        }));

    await this.parameterToEventAssociationRepo.createManyPlainInTransaction(
      parameterToEventAssociationOnlyFromNewEvents,
      transactionManager,
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
          eventId: indexedEvents[eventUUID].id,
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

    this.areThereDuplicateUUIDs(eventParameters, 'event parameter');
    this.areThereDuplicateUUIDs(events, 'event');
    this.areThereDuplicateUUIDs(routeEndpoints, 'route endpoint');
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

  private areThereDuplicateUUIDs<T extends { uuid: string }>(
    entities: T[],
    entityName: string,
  ) {
    const entitiesUUIDs = entities.map(({ uuid }) => uuid);
    const entitiesUUIDsWithoutDuplicates = new Set(entitiesUUIDs);
    if (entitiesUUIDsWithoutDuplicates.size !== entitiesUUIDs.length)
      throw new Error(`You requested duplicate ${entityName}s uuids`);
  }
}
