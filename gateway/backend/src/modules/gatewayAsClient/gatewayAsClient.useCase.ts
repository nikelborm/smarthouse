import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter } from 'stream';
import { GATEWAY_AS_CLIENT_INITIALIZER_KEY } from './gatewayAsClientInitializer.provider';

@Injectable()
export class GatewayAsClientUseCase {
  constructor(
    @Inject(GATEWAY_AS_CLIENT_INITIALIZER_KEY)
    gatewayAsClientInitializer,
  ) {
    console.log('GatewayAsClientUseCase contructor');
  }

  private readonly gatewayReceiverEmitter = new EventEmitter();

  getAllEndpointsUUIDs() {
    return [];
  }
}
