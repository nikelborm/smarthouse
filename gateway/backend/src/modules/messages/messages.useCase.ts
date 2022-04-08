import { Inject, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
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
  private readonly messagesWaitingForResponseStore = new Map<
    string, // `${messageUUID}${sinkEndpointUUID}`
    { sourceEndpointUUID: string }
  >();

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

  sendToManyClientsBy(
    predicate: (client: model.Client) => boolean,
    getEncryptedMessagesForMatchedClient: (
      client: model.Client,
    ) => Promise<string[]>,
  ): void;
  sendToManyClientsBy(
    UUIDs: string[],
    getEncryptedMessagesForMatchedClient: (
      client: model.Client,
    ) => Promise<string[]>,
  ): void;
  async sendToManyClientsBy(
    UUIDsOrPredicate: string[] | ((client: model.Client) => boolean),
    getEncryptedMessagesForMatchedClient: (
      client: model.Client,
    ) => Promise<string[]>,
  ) {
    return this.wsservice.sendToClientsBy(
      UUIDsOrPredicate,
      getEncryptedMessagesForMatchedClient,
    );
  }

  getOnlineClientUUIDs() {
    return this.wsservice.getOnlineClientUUIDs();
  }

  async emitNewMessage(
    parsedMessage: DecryptedRegularMessage,
    endpointToUseAsSource: model.Endpoint,
  ) {
    const validationErrors = validate(parsedMessage, DecryptedRegularMessage);
    if (validationErrors.length)
      throw new Error('Message from authorized client: Validation error');

    await this.validateIncomingMessage(endpointToUseAsSource, parsedMessage);

    if (
      endpointToUseAsSource.event.type === EventType.QUERY &&
      endpointToUseAsSource.type === EndpointType.EVENT_SINK
    ) {
      const messageTag = `${parsedMessage.replyForMessageUUID}${parsedMessage.endpointUUID}`;
      if (this.messagesWaitingForResponseStore.has(messageTag)) {
        const { sourceEndpointUUID } =
          this.messagesWaitingForResponseStore.get(messageTag);

        await this.wsservice.sendToClientsBy(
          ({ endpoints }) =>
            endpoints.some(({ uuid }) => sourceEndpointUUID === uuid),

          async (clientReceiver) => [
            await this.encryptMessage(clientReceiver, {
              endpointUUID: sourceEndpointUUID,
              messageUUID: parsedMessage.messageUUID,
              parameters: parsedMessage.parameters,
              replyForMessageUUID: parsedMessage.replyForMessageUUID,
            }),
          ],

          { untilFirstMatch: true },
        );

        this.messagesWaitingForResponseStore.delete(messageTag);
        return;
      }
      throw new Error(
        `you cannot reply for message ${parsedMessage.replyForMessageUUID} because you didnt get it`,
      );
    }

    const dataConsumerEndpoints = await this.routeRepo.getManyRoutesBy({
      sourceEndpointId: endpointToUseAsSource.id,
    });

    const dataConsumerClientIds = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { clientId } }) => clientId),
    );

    const dataConsumerEndpointUUIDs = new Set(
      dataConsumerEndpoints.map(({ sinkEndpoint: { uuid } }) => uuid),
    );

    await this.wsservice.sendToClientsBy(
      ({ id }) => dataConsumerClientIds.has(id),
      async (clientReceiver) => {
        const encryptedMessages: string[] = [];
        for (const { uuid: receiverEndpointUUID } of clientReceiver.endpoints) {
          if (!dataConsumerEndpointUUIDs.has(receiverEndpointUUID)) continue;

          const message: DecryptedRegularMessage = {
            endpointUUID: receiverEndpointUUID,
            messageUUID: parsedMessage.messageUUID,
            parameters: parsedMessage.parameters,
          };

          if (
            endpointToUseAsSource.event.type === EventType.QUERY &&
            endpointToUseAsSource.type === EndpointType.EVENT_SOURCE
          )
            this.messagesWaitingForResponseStore.set(
              `${parsedMessage.messageUUID}${receiverEndpointUUID}`,
              {
                sourceEndpointUUID: endpointToUseAsSource.uuid,
              },
            );

          const encryptedMessage = await this.encryptMessage(
            clientReceiver,
            message,
          );

          encryptedMessages.push(encryptedMessage);
        }
        return encryptedMessages;
      },
    );
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

  private authedMessageCB: AuthedMessageCB = async (message, clientSender) => {
    const worker = this.encryptionUseCase.getEncryptionWorker(
      clientSender.encryptionWorkerUUID,
    );

    const jsonString = await worker.decryptEncryptedJsonStringSentFromClient(
      clientSender.encryptionWorkerCredentials,
      message.toString(),
    );

    const parsedMessage: DecryptedRegularMessage = JSON.parse(jsonString);
    console.log('authedMessageCB parsedMessage: ', parsedMessage);

    const endpoint = clientSender.endpoints.find(
      ({ uuid }) => parsedMessage.endpointUUID === uuid,
    );

    await this.emitNewMessage(parsedMessage, endpoint);
  };

  private authedClientOfflineCB: OnlineStatusChangedCB = async (client) => {
    console.log(`Client ${client.uuid} disconnected`);
  };

  private encryptMessage(
    clientReceiver: model.Client,
    message: DecryptedRegularMessage,
  ) {
    return this.encryptionUseCase
      .getEncryptionWorker(clientReceiver.encryptionWorkerUUID)
      .encryptJsonStringToSendToClient(
        clientReceiver.encryptionWorkerCredentials,
        JSON.stringify(message),
      );
  }

  private async validateIncomingMessage(
    endpointToUseAsSource: model.Endpoint,
    parsedMessage: DecryptedRegularMessage,
  ) {
    if (!endpointToUseAsSource)
      throw new Error(
        `Client does not have endpoint ${parsedMessage.endpointUUID} and cannot use it`,
      );

    if (endpointToUseAsSource.uuid !== parsedMessage.endpointUUID)
      throw new Error(
        'Internal error: parsedMessage.endpointUUID is not equal to endpointToUseAsSource.uuid',
      );

    const canClientSendMessageWithEndpoint =
      endpointToUseAsSource.type === EndpointType.EVENT_SOURCE ||
      (endpointToUseAsSource.type === EndpointType.EVENT_SINK &&
        endpointToUseAsSource.event.type === EventType.QUERY);

    if (!canClientSendMessageWithEndpoint)
      throw new Error(
        `Clients cannot send messages using not source endpoint ${parsedMessage.endpointUUID}`,
      );

    if (
      endpointToUseAsSource.type === EndpointType.EVENT_SOURCE &&
      endpointToUseAsSource.event.type === EventType.QUERY &&
      parsedMessage.replyForMessageUUID
    )
      throw new Error(
        `Client cannot set "replyForMessageUUID" field when they are using query source endpoint ${parsedMessage.endpointUUID}`,
      );

    if (
      endpointToUseAsSource.type === EndpointType.EVENT_SINK &&
      endpointToUseAsSource.event.type === EventType.QUERY &&
      !parsedMessage.replyForMessageUUID
    )
      throw new Error(
        `Client must set "replyForMessageUUID" field when they are using query sink endpoint ${parsedMessage.endpointUUID}`,
      );

    const {
      event: { parameterAssociations },
    } = endpointToUseAsSource;

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
