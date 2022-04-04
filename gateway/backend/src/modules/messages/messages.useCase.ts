import { Injectable } from '@nestjs/common';
import { WebsocketService } from './websocket.service';

@Injectable()
export class MessagesUseCase {
  private readonly websocketService: WebsocketService;

  constructor() {
    // this.websocketService = new WebsocketService({
    //   port: 4999,
    //   authRequestCB: () => {},
    //   authedMessageCB: () => {},
    //   authedClientOfflineCB: () => {},
    // });
  }
}
