import { Injectable } from '@nestjs/common';
import {
  AuthMessage,
  DecryptedRegularMessage,
  EndpointType,
  EventType,
  validate,
} from 'src/types';
import { EncryptionUseCase } from '../encryption';
import { repo } from '../infrastructure';
import {
  WebsocketService,
  AuthedMessageCB,
  AuthRequestCB,
  OnlineStatusChangedCB,
} from './websocket.service';

@Injectable()
export class MessagesUseCase {
  constructor(
    private readonly clientRepo: repo.ClientRepo,
    private readonly routeRepo: repo.RouteRepo,
    private readonly encryptionUseCase: EncryptionUseCase,
  ) {
    new WebsocketService({
      port: 4999,
      authRequestCB: this.authRequestCB,
      authedMessageCB: this.authedMessageCB,
      authedClientOfflineCB: this.authedClientOfflineCB,
    });
  }

  authRequestCB: AuthRequestCB = async (message) => {
    const validationErrors = validate(message, AuthMessage);
    if (validationErrors.length)
      throw new Error('Authorization: validation error');

    const client = await this.clientRepo.getOneWithInfoAboutSupportedStuffBy(
      message.clientUUID,
    );

    const worker = this.encryptionUseCase.getEncryptionWorker(
      client.encryptionWorker.uuid,
    );

    const isCredentialsValid = worker.validateAuthRequestFromClient(
      client.encryptionWorkerCredentials,
      message,
    );

    return isCredentialsValid
      ? {
          isAuthorized: true as const,
          client: client,
        }
      : {
          isAuthorized: false as const,
        };
  };

  authedMessageCB: AuthedMessageCB = async (message, client) => {
    try {
      const worker = this.encryptionUseCase.getEncryptionWorker(
        client.encryptionWorker.uuid,
      );

      const jsonString = await worker.decryptEncryptedJsonStringSentFromClient(
        client.encryptionWorkerCredentials,
        message.toString(),
      );

      const parsedMessage: DecryptedRegularMessage = JSON.parse(jsonString);

      const validationErrors = validate(parsedMessage, DecryptedRegularMessage);
      if (validationErrors.length) throw new Error('Validation error');

      const endpoint = client.endpoints.find(
        ({ uuid }) => parsedMessage.endpointUUID === uuid,
      );

      if (!endpoint)
        throw new Error(
          `Client does not have permission to use endpoint ${parsedMessage.endpointUUID}`,
        );

      const canClientSendMessageWithEndpoint =
        endpoint.type === EndpointType.EVENT_SOURCE ||
        (endpoint.type === EndpointType.EVENT_SINK &&
          endpoint.event.type === EventType.QUERY);

      if (!canClientSendMessageWithEndpoint)
        throw new Error(
          `Clients cannot send messages using not source endpoint ${parsedMessage.endpointUUID}`,
        );

      const {
        event: { parameterAssociations },
      } = endpoint;
    } catch (error) {
      console.log(`authRequestCB ~ ${client.uuid} ~ error`, error);
    }
  };

  authedClientOfflineCB: OnlineStatusChangedCB = async () => {
    console.log();
  };
}
