import { Module } from '@nestjs/common';
import { DataValidatorModule } from '../dataValidator';
import { EncryptionModule } from '../encryption';
import { MessagesUseCase } from './messages.useCase';

@Module({
  imports: [DataValidatorModule, EncryptionModule],
  providers: [MessagesUseCase],
  exports: [MessagesUseCase],
})
export class MessagesModule {}
