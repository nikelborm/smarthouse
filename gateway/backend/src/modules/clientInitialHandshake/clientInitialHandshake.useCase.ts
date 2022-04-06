import { Injectable } from '@nestjs/common';
import { InitHandshakeQuery, InitHandshakeResponse } from 'src/types';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { repo } from '../infrastructure';
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
    return new Promise((resolve, reject) => {
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
    console.log('transactionManager: ', transactionManager);
    console.log('handshakeRequest: ', handshakeRequest);

    const encryptionWorker = this.encryptionUseCase.getEncryptionWorker(
      handshakeRequest.encryptionWorkerUUID,
    );

    await this.eventParameterRepo.insertInTransactionOnlyNewEventParameters(
      handshakeRequest.supported.eventParameters,
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

  async validateHandshakeRequest(
    transactionManager: EntityManager,
    {
      supported: { eventParameters, events, routeEndpoints, transport },
      encryptionWorkerCredentials,
      ...restHandshake
    }: InitHandshakeQuery,
    encryptionWorker: IEncryptionWorker<any, any, any>,
  ) {
    if (
      !encryptionWorker.isClientSideHandshakeCredentialsValid(
        encryptionWorkerCredentials,
      )
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

    const unknownParameterUUIDsRequestedByEvents = differenceBetweenSetsInArray(
      new Set(grantedParameterUUIDs),
      parameterUUIDsRequestedByEvents,
    );
  }

  areThereDuplicateUUIDs<T extends { uuid: string }>(
    entities: T[],
    entityName: string,
  ) {
    const entitiesUUIDs = entities.map(({ uuid }) => uuid);
    const entitiesUUIDsWithoutDuplicates = new Set(entitiesUUIDs);
    if (entitiesUUIDsWithoutDuplicates.size !== entitiesUUIDs.length)
      throw new Error(`You requested duplicate ${entityName}s uuids`);
  }
}
