import { Injectable } from '@nestjs/common';
import { differenceBetweenSetsInArray } from 'src/tools';
import {
  AuthMessage,
  DecryptedRegularMessage,
  EndpointType,
  EventType,
  validate,
} from 'src/types';
import { DataValidatorUseCase } from '../dataValidator';
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
    private readonly dataValidatorUseCase: DataValidatorUseCase,
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
          `Client does not have endpoint ${parsedMessage.endpointUUID} and cannot use it`,
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

      const requiredEventParametersUUIDs = parameterAssociations
        .filter(({ isParameterRequired }) => isParameterRequired)
        .map(({ eventParameter: { uuid } }) => uuid);

      const allEventParametersUUIDs = parameterAssociations.map(
        ({ eventParameter: { uuid } }) => uuid,
      );

      const allMessageParametersUUIDs = parsedMessage.parameters.map(
        ({ uuid }) => uuid,
      );

      if (parsedMessage?.parameters?.length) {
        const messageParametersUUIDsWithoutDuplicates = new Set(
          allMessageParametersUUIDs,
        );

        if (
          messageParametersUUIDsWithoutDuplicates.size <
          allMessageParametersUUIDs.length
        )
          throw new Error(`Message contains duplicate parameters`);

        const redundantParametersUUIDs = differenceBetweenSetsInArray(
          messageParametersUUIDsWithoutDuplicates,
          new Set(allEventParametersUUIDs),
        );

        if (redundantParametersUUIDs.length > 0)
          throw new Error(
            `Found message parameters that should NOT be sent ${redundantParametersUUIDs}`,
          );

        const notSentParametersUUIDs = differenceBetweenSetsInArray(
          new Set(requiredEventParametersUUIDs),
          messageParametersUUIDsWithoutDuplicates,
        );

        if (notSentParametersUUIDs.length > 0)
          throw new Error(
            `Found message parameters that should be sent ${notSentParametersUUIDs}`,
          );

        const paramToValidator = Object.fromEntries(
          parameterAssociations.map(
            ({
              eventParameter: {
                uuid: parameterUUID,
                dataValidator: { uuid: validatorUUID },
              },
            }) => [parameterUUID, validatorUUID],
          ),
        );

        for (const messageParam of parsedMessage.parameters) {
          const doesValueMatchItsType = this.dataValidatorUseCase
            .getValidator(paramToValidator[messageParam.uuid])
            .verify(messageParam.value);

          if (!doesValueMatchItsType) throw new Error('Incorrect value format');
        }
      } else {
        if (requiredEventParametersUUIDs.length)
          throw new Error('Some required parameters are not specified');
      }
    } catch (error) {
      console.log(`authRequestCB ~ ${client.uuid} ~ error`, error);
    }
  };

  authedClientOfflineCB: OnlineStatusChangedCB = async () => {
    console.log();
  };
}
