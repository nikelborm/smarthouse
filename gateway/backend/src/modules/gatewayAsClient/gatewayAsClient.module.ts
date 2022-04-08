import { Module } from '@nestjs/common';
import { DataValidatorModule } from '../dataValidator';
import { EncryptionModule } from '../encryption';
import { MessagesModule } from '../messages';
import { GatewayAsClientUseCase } from './gatewayAsClient.useCase';
import { GatewayAsClientInitializer } from './gatewayAsClientInitializer.provider';

@Module({
  imports: [MessagesModule],
  providers: [GatewayAsClientUseCase, GatewayAsClientInitializer],
  exports: [GatewayAsClientUseCase],
})
export class GatewayAsClientModule {}
