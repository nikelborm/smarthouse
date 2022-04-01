import { Module } from '@nestjs/common';
import { GatewayEndpointsUseCase } from './gatewayEndpoints.useCase';

@Module({
  providers: [GatewayEndpointsUseCase],
  exports: [GatewayEndpointsUseCase],
})
export class GatewayEndpointsModule {}
