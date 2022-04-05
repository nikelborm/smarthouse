import { Injectable } from '@nestjs/common';
import {
  InitHandshakeQuery,
  InitHandshakeResponse,
  RequestedEventParameter,
} from 'src/types';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { repo } from '../infrastructure';
import { EncryptionUseCase } from '../encryption';

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

    if (
      !encryptionWorker.isClientSideHandshakeCredentialsValid(
        handshakeRequest.encryptionWorkerCredentials,
      )
    )
      throw new Error('You have sent bad credentials');

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
}
