import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { MessagesUseCase } from './messages.useCase';

@Module({
  providers: [MessagesUseCase, WebsocketService],
  exports: [MessagesUseCase],
})
export class MessagesModule {}
