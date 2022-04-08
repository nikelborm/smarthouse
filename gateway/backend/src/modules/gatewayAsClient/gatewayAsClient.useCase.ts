import { Inject, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { DecryptedRegularMessage } from 'src/types';
import { EventEmitter } from 'stream';
import { MessagesUseCase } from '../messages';
import { GATEWAY_AS_CLIENT_INITIALIZER_KEY } from './gatewayAsClientInitializer.provider';

@Injectable()
export class GatewayAsClientUseCase {
  private readonly allEndpoinUUIDs: string[] = [];
  private readonly busyEndpoinUUIDs: string[] = [];

  constructor(
    @Inject(GATEWAY_AS_CLIENT_INITIALIZER_KEY)
    private readonly allowedEndpointsUUIDs: string[],
    private readonly messagesUseCase: MessagesUseCase,
  ) {
    console.log('GatewayAsClientUseCase contructor');
  }

  private readonly gatewayReceiverEmitter = new EventEmitter();

  registerEndpointOfGateway(
    endpoinUUID: string,
    handler: (message: DecryptedRegularMessage) => void,
  ) {
    if (!isUUID(endpoinUUID))
      throw new Error(
        'GatewayAsClientUseCase registerEndpointOfGateway: endpoinUUID should be UUID string',
      );

    if (this.gatewayReceiverEmitter.eventNames().includes(endpoinUUID))
      throw new Error(
        `GatewayAsClientUseCase registerEndpointOfGateway: handler for endpoinUUID ${endpoinUUID} already registered`,
      );

    if (!this.allowedEndpointsUUIDs.includes(endpoinUUID))
      throw new Error(
        `GatewayAsClientUseCase registerEndpointOfGateway: endpoinUUID ${endpoinUUID} does not exist in the database`,
      );

    this.gatewayReceiverEmitter.on(endpoinUUID, handler);
  }
}
