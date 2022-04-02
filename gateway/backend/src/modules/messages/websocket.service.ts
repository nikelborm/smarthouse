import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, WebSocket } from 'ws';

@Injectable()
export class WebsocketService {
  private readonly server: Server<WebSocketCustomClient>;
  private deadSocketsCleanerInterval: NodeJS.Timer;

  constructor(private readonly configService: ConfigService) {
    this.server = new Server({
      port: 4999,
    });
    this.startDeadSocketCleaning();
  }

  getOnlineClientUUIDs() {
    return [...this.server.clients]
      .filter(({ isAuthorized }) => isAuthorized)
      .map((client) => client.session.clientUUID);
  }

  private startDeadSocketCleaning() {
    this.deadSocketsCleanerInterval = setInterval(() => {
      // Проверка на то, оставлять ли соединение активным
      this.server.clients.forEach((connection) => {
        // Если соединение мертво, завершить
        if (!connection.isAlive) {
          return connection.terminate();
        }
        // обьявить все соединения мертвыми, а тех кто откликнется на ping, сделать живыми
        connection.isAlive = false;
        connection.ping(null, false);
      });
    }, 10000); // TODO: move to config
  }
}

interface WebSocketCustomClient extends WebSocket {
  session: {
    clientUUID: string;
  };
  isAuthorized: boolean;
  isAlive: boolean;
}
