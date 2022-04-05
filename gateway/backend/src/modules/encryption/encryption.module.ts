import { Module } from '@nestjs/common';
import { EncryptionUseCase } from './encryption.useCase';
import { EncryptionModuleInitializer } from './encryptionModuleInitializer.provider';

@Module({
  providers: [EncryptionUseCase, EncryptionModuleInitializer],
  exports: [EncryptionUseCase],
})
export class EncryptionModule {}
