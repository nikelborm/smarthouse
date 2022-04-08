import { Module } from '@nestjs/common';
import { DataValidatorModule } from '../dataValidator';
import { EncryptionModule } from '../encryption';
import { MessagesUseCase } from './messages.useCase';
import { WebsocketServiceFactory } from './websocketService.provider';

@Module({
  imports: [DataValidatorModule, EncryptionModule],
  providers: [MessagesUseCase, WebsocketServiceFactory],
  exports: [MessagesUseCase],
})
export class MessagesModule {}
