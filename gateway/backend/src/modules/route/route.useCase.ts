import { Injectable } from '@nestjs/common';
import {
  DecryptedRegularMessage,
  SupportedEventsParamsEndpoints,
} from 'src/types';
import { GatewayAsClientUseCase } from '../gatewayAsClient';
import { repo } from '../infrastructure';
import { MessagesUseCase } from '../messages';

@Injectable()
export class RouteUseCase {
  constructor(
    private readonly routeRepo: repo.RouteRepo,
    private readonly gatewayAsClientUseCase: GatewayAsClientUseCase,
    private readonly messagesUseCase: MessagesUseCase,
  ) {
    gatewayAsClientUseCase.registerEndpointOfGateway(
      SupportedEventsParamsEndpoints.CREATE_ROUTE_ENDPOINT,
      this.createRouteEndpointMessageHandler,
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
}
