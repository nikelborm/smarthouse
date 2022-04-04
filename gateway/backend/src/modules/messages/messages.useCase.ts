import { Injectable } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Injectable()
export class MessagesUseCase {
  constructor(private readonly WSService: WebsocketService) {}
}
