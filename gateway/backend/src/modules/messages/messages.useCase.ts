import { Inject, Injectable } from '@nestjs/common';
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
import { model, repo } from '../infrastructure';
import {
  WebsocketService,
  AuthedMessageCB,
  AuthRequestCB,
  OnlineStatusChangedCB,
} from './websocket.service';
import {
  IWebsocketServiceFactory,
  WEBSOCKET_SERVICE_FACTORY_KEY,
} from './websocketService.provider';

@Injectable()
export class MessagesUseCase {
  private readonly wsservice: WebsocketService;
  constructor(
    private readonly clientRepo: repo.ClientRepo,
    private readonly routeRepo: repo.RouteRepo,
    private readonly dataValidatorUseCase: DataValidatorUseCase,
    private readonly encryptionUseCase: EncryptionUseCase,
    @Inject(WEBSOCKET_SERVICE_FACTORY_KEY)
    private readonly websocketServiceFactory: IWebsocketServiceFactory,
  ) {
    this.wsservice = this.websocketServiceFactory.create({
      authRequestCB: this.authRequestCB,
      authedMessageCB: this.authedMessageCB,
      authedClientOfflineCB: this.authedClientOfflineCB,
    });
  }

  private authRequestCB: AuthRequestCB = async (message) => {
    const validationErrors = validate(message, AuthMessage);
    console.log('authRequestCB message: ', message);
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

    await this.validateMessage(endpoint, parsedMessage);

    const dataConsumerEndpoints = await this.routeRepo.getManyRoutesBySource(
      endpoint.id,
    );

    const dataConsumerClientIds = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { clientId } }) => clientId),
    );

    const dataConsumerEndpointUUIDs = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { uuid } }) => uuid),
    );

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

    // this.wsservice.sendToManyClientsBy()
  };

  private authedClientOfflineCB: OnlineStatusChangedCB = async (client) => {
    console.log(`Client ${client.uuid} disconnected`);
  };

  private async validateMessage(
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
