import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { differenceBetweenSetsInArray } from 'src/tools';
import {
  AuthMessage,
  DecryptedRegularMessage,
  EndpointType,
  EventType,
  validate,
} from 'src/types';
import { EventEmitter } from 'stream';
import { DataValidatorUseCase } from '../dataValidator';
import { EncryptionUseCase } from '../encryption';
import { model, repo } from '../infrastructure';
import {
  WebsocketService,
  AuthedMessageCB,
  AuthRequestCB,
  OnlineStatusChangedCB,
} from './websocket.service';

@Injectable()
export class MessagesUseCase {
  private readonly wsservice: WebsocketService;
  constructor(
    private readonly clientRepo: repo.ClientRepo,
    private readonly routeRepo: repo.RouteRepo,
    private readonly configService: ConfigService,
    private readonly dataValidatorUseCase: DataValidatorUseCase,
    private readonly encryptionUseCase: EncryptionUseCase,
  ) {
    this.wsservice = new WebsocketService({
      port: this.configService.get('webSocketServerPort'),
      authRequestCB: this.authRequestCB,
      authedMessageCB: this.authedMessageCB,
      authedClientOfflineCB: this.authedClientOfflineCB,
    });
  }

  private authRequestCB: AuthRequestCB = async (message) => {
    const validationErrors = validate(message, AuthMessage);
    console.log('message: ', message);
    if (validationErrors.length)
      throw new Error('Authorization: validation error');

    const client = await this.clientRepo.getOneWithInfoAboutSupportedStuffBy(
      message.clientUUID,
    );

    const worker = this.encryptionUseCase.getEncryptionWorker(
      client.encryptionWorkerUUID,
    );

    const isCredentialsValid = await worker.isAuthRequestFromClientValid(
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

  private authedMessageCB: AuthedMessageCB = async (message, client) => {
    const worker = this.encryptionUseCase.getEncryptionWorker(
      client.encryptionWorkerUUID,
    );

    const jsonString = await worker.decryptEncryptedJsonStringSentFromClient(
      client.encryptionWorkerCredentials,
      message.toString(),
    );

    const parsedMessage: DecryptedRegularMessage = JSON.parse(jsonString);
    console.log('authedMessageCB parsedMessage: ', parsedMessage);

    const validationErrors = validate(parsedMessage, DecryptedRegularMessage);
    if (validationErrors.length)
      throw new Error('Message from authorized client: Validation error');

    const endpoint = client.endpoints.find(
      ({ uuid }) => parsedMessage.endpointUUID === uuid,
    );

    this.validateMessage(endpoint, parsedMessage);

    // if this.messageWithGatewayAsRecipientHandler.subscribed ForEndpoints
    const dataConsumerEndpoints = await this.routeRepo.getManyRoutesBySource(
      endpoint.id,
    );
    console.log('dataConsumerEndpoints: ', dataConsumerEndpoints);
    console.log(7);
    const dataConsumerClientIds = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { clientId } }) => clientId),
    );
    console.log(8);
    const dataConsumerEndpointUUIDs = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { uuid } }) => uuid),
    );
    console.log(9);
    this.wsservice.sendToManyClientsBy(
      ({ id }) => dataConsumerClientIds.has(id),
      async (client) => {
        const encryptedMessages: string[] = [];
        for (const { uuid: endpointUUID } of client.endpoints) {
          if (!dataConsumerEndpointUUIDs.has(endpointUUID)) continue;

          const message: DecryptedRegularMessage = {
            endpointUUID,
            messageUUID: parsedMessage.messageUUID,
            parameters: parsedMessage.parameters,
          };

          // TODO: сюда кажется надо добавить как раз ту хуйню с сериализацией параметров
          // а может и не надо потому что мы по факту отправляем то что приняли и оно уже
          // по сути сериализовано, если пихнули в сообщение
          const encryptedMessage = await this.encryptionUseCase
            .getEncryptionWorker(client.encryptionWorkerUUID)
            .encryptJsonStringToSendToClient(
              client.encryptionWorkerCredentials,
              JSON.stringify(message),
            );

          encryptedMessages.push(encryptedMessage);
        }
        return encryptedMessages;
      },
    );

    console.log(
      '🚀 ~ file: messages.useCase.ts ~ line 90 ~ MessagesUseCase ~ authedMessageCB:AuthedMessageCB= ~ dataConsumerEndpoints',
      dataConsumerEndpoints,
    );
    // this.wsservice.sendToManyClientsBy()
  };

  private authedClientOfflineCB: OnlineStatusChangedCB = async () => {
    console.log('asd');
  };

  private validateMessage(
    endpoint: model.Endpoint,
    parsedMessage: DecryptedRegularMessage,
  ) {
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

    if (
      !parsedMessage?.parameters?.length &&
      requiredEventParametersUUIDs.length
    )
      throw new Error('Some required parameters are not specified');

    if (!parsedMessage?.parameters?.length) return;

    const allMessageParametersUUIDs = parsedMessage.parameters.map(
      ({ uuid }) => uuid,
    );

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
  }
}

class MessageWithGatewayAsRecipientEmitter extends EventEmitter {}
