import { Module } from '@nestjs/common';
import { EncryptionUseCase } from './encryption.useCase';

@Module({
  providers: [EncryptionUseCase],
  exports: [EncryptionUseCase],
})
export class EncryptionModule {}
