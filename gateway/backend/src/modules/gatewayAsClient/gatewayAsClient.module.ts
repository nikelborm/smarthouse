import { Module } from '@nestjs/common';
import { DataValidatorModule } from '../dataValidator';
import { EncryptionModule } from '../encryption';
import { GatewayAsClientUseCase } from './gatewayAsClient.useCase';
import { GatewayAsClientInitializer } from './gatewayAsClientInitializer.provider';

@Module({
  imports: [EncryptionModule, DataValidatorModule],
  providers: [GatewayAsClientUseCase, GatewayAsClientInitializer],
  exports: [GatewayAsClientUseCase],
})
export class GatewayAsClientModule {}
