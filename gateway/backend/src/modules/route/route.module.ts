import { Module } from '@nestjs/common';
import { GatewayAsClientModule } from '../gatewayAsClient';
import { MessagesModule } from '../messages';
import { RouteUseCase } from './route.useCase';

@Module({
  imports: [GatewayAsClientModule, MessagesModule],
  providers: [RouteUseCase],
  exports: [RouteUseCase],
})
export class RouteModule {}
