import { Module } from '@nestjs/common';
import { MessagesUseCase } from './messages.useCase';

@Module({
  providers: [MessagesUseCase],
  exports: [MessagesUseCase],
})
export class MessagesModule {}
