import { Injectable } from '@nestjs/common';
import { InitHandshakeQuery, InitHandshakeResponse, validate } from 'src/types';
import { DeepPartial, EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { model, repo } from '../infrastructure';
import { EncryptionUseCase } from '../encryption';
import { differenceBetweenSetsInArray, doesArraysIntersects } from 'src/tools';
import { IEncryptionWorker } from '../encryption/IEncryptionWorker';

@Injectable()
export class ClientInitialHandshakeUseCase {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly eventRepo: repo.EventRepo,
    private readonly encryptionWorkerRepo: repo.EncryptionWorkerRepo,
    private readonly encryptionUseCase: EncryptionUseCase,
    private readonly clientRepo: repo.ClientRepo,
    private readonly eventParameterRepo: repo.EventParameterRepo,
    private readonly parameterToEventAssociationRepo: repo.ParameterToEventAssociationRepo,
  ) {}

  async init(handshakeRequest: InitHandshakeQuery) {
    return new Promise<InitHandshakeResponse>((resolve, reject) => {
      this.entityManager.transaction(async (transactionManager) => {
        try {
          resolve(
            await this.renameMeLater(transactionManager, handshakeRequest),
          );
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async renameMeLater(
    transactionManager: EntityManager,
    handshakeRequest: InitHandshakeQuery,
  ): Promise<InitHandshakeResponse> {
    await this.validateHandshakeRequest(handshakeRequest);

    const encryptionWorker = this.encryptionUseCase.getEncryptionWorker(
      handshakeRequest.encryptionWorkerUUID,
    );

    const asd =
      await this.eventParameterRepo.insertInTransactionOnlyNewEventParameters(
        handshakeRequest.supported.eventParameters,
        transactionManager,
      );
    console.log('asd: ', asd);

    const eventToParameterAssociationsToInsert = [];
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

    await this.eventRepo.insertInTransactionOnlyNewEvents(
      eventsToInsert,
      transactionManager,
    );

    // RequestedEventParameter
    // RequestedEndpoint

    const { credentialsToStoreInDatabase, credentialsToSendBackToClient } =
      await encryptionWorker.getServerSideHandshakeCredentials(
        handshakeRequest.encryptionWorkerCredentials,
      );

    await this.clientRepo.createOneInTransactionWithRelations(
      {
        uuid: handshakeRequest.uuid,
        description: handshakeRequest.description,
        fullname: handshakeRequest.description,
        shortname: handshakeRequest.description,
        encryptionWorkerCredentials: credentialsToStoreInDatabase,
        encryptionWorkerUUID: handshakeRequest.encryptionWorkerUUID,
        // endpoints,
      },
      transactionManager,
    );

    this.eventRepo.createManyWithRelations([{}]);

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
        encryptionModuleCredentials: {}, //credentialsToSendBackToClient,
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
    console.log('validationErrors: ', validationErrors);
    if (validationErrors.length)
      throw new Error('InitHandshakeQuery: validation error');

    const encryptionWorker =
      this.encryptionUseCase.getEncryptionWorker(encryptionWorkerUUID);

    if (
      !(await encryptionWorker.isClientSideHandshakeCredentialsValid(
        encryptionWorkerCredentials,
      ))
    )
      throw new Error('You have sent bad credentials');

    this.areThereDuplicateUUIDs(eventParameters, 'event parameter');
    this.areThereDuplicateUUIDs(events, 'event');
    this.areThereDuplicateUUIDs(routeEndpoints, 'route endpoint');

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
