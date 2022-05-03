import { Injectable } from '@nestjs/common';
import {
  DecryptedRegularMessage,
  SupportedEventsParamsEndpoints,
} from 'src/types';
import { repo } from '../infrastructure';
import { MessagesUseCase } from '../messages';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RouteUseCase {
  constructor(
    private readonly endpointRepo: repo.EndpointRepo,
    private readonly routeRepo: repo.RouteRepo,
    private readonly messagesUseCase: MessagesUseCase,
  ) {
    messagesUseCase.registerEndpointOfGateway(
      SupportedEventsParamsEndpoints.CREATE_ROUTE_SINK_ENDPOINT,
      this.createRouteEndpointMessageHandler.bind(this),
    );
    messagesUseCase.registerEndpointOfGateway(
      SupportedEventsParamsEndpoints.GET_ALL_ROUTES_SINK_ENDPOINT,
      this.getRoutesMessageHandler.bind(this),
    );
  }

  async createRouteEndpointMessageHandler(message: DecryptedRegularMessage) {
    const sinkEndpointId = message.getParameterValueBy(
      SupportedEventsParamsEndpoints.ROUTE_INCOMING_ENDPOINT_ID_PARAMETER,
    );

    const sourceEndpointId = message.getParameterValueBy(
      SupportedEventsParamsEndpoints.ROUTE_OUTCOMING_ENDPOINT_ID_PARAMETER,
    );

    await this.routeRepo.createOnePlain({
      sinkEndpointId,
      sourceEndpointId,
    });
  }

  async getRoutesMessageHandler(message: DecryptedRegularMessage) {
    const sinkEndpointId = message.getParameterValueBy(
      SupportedEventsParamsEndpoints.ROUTE_INCOMING_ENDPOINT_ID_PARAMETER,
    );

    const sourceEndpointId = message.getParameterValueBy(
      SupportedEventsParamsEndpoints.ROUTE_OUTCOMING_ENDPOINT_ID_PARAMETER,
    );

    const value = await this.routeRepo.getManyRoutesBy({
      sinkEndpointId,
      sourceEndpointId,
    });

    await this.messagesUseCase.emitNewMessage(
      {
        endpointUUID: SupportedEventsParamsEndpoints.GET_ALL_ROUTES_SINK_ENDPOINT,
        replyForMessageUUID: message.messageUUID,
        messageUUID: uuidv4(),
        parameters: [
          ...(message.parameters || []),
          {
            uuid: SupportedEventsParamsEndpoints.JSON_RESPONSE_PARAMETER,
            value: JSON.stringify(value),
          },
        ],
      },
      await this.endpointRepo.getOneByUUID(
        SupportedEventsParamsEndpoints.GET_ALL_ROUTES_SINK_ENDPOINT,
      ),
    );
  }
}
