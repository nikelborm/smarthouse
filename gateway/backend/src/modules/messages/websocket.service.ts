import { ConfigService } from '@nestjs/config';
import { AuthMessage } from 'src/types';
import { RawData, Server, WebSocket } from 'ws';
import { model } from '../infrastructure';

export class WebsocketService {
  private readonly server: Server<WebSocketCustomClient>;
  private deadSocketsCleanerInterval: NodeJS.Timer;

  constructor(
    private readonly configService: ConfigService,
    private readonly callbacks: {
      authRequestCB: AuthRequestCB;
      authedMessageCB: AuthedMessageCB;
      authedClientOfflineCB: OnlineStatusChangedCB;
    },
  ) {
    this.server = new Server({
      port: this.configService.get('webSocketServerPort'),
    });

    this.handleConnections();
    this.startDeadSocketCleaning();
  }

  getOnlineClientUUIDs() {
    return [...this.server.clients]
      .filter(({ isAuthorized }) => isAuthorized)
      .map((connection) => connection.client.uuid);
  }

  async sendToClientsBy(
    UUIDsOrPredicate: string[] | ((client: model.Client) => boolean),
    getEncryptedMessagesForMatchedClient: (
      client: model.Client,
    ) => Promise<string[]>,
    config?: {
      untilFirstMatch: boolean;
    },
  ) {
    let predicate: (socket: WebSocketCustomClient) => boolean;

    if (typeof UUIDsOrPredicate == 'function') {
      predicate = ({ isAuthorized, client }) =>
        isAuthorized && UUIDsOrPredicate(client);
    } else {
      const uuids = new Set(UUIDsOrPredicate);
      predicate = (socket) =>
        socket.isAuthorized && uuids.has(socket.client.uuid);
    }

    for (const connection of this.server.clients) {
      if (!predicate(connection)) continue;

      const encryptedMessages = await getEncryptedMessagesForMatchedClient(
        connection.client,
      );

      encryptedMessages.forEach((message) => connection.send(message));
      if (config?.untilFirstMatch) break;
    }
  }

  private handleConnections() {
    this.server.on('connection', (socket) => {
      socket.isAlive = true;

      socket.on('pong', () => {
        socket.isAlive = true;
      });

      socket.once('message', async (message) => {
        try {
          await this.firstAuthMesssageHandler(socket, message);
        } catch (error: any) {
          console.log('first client message handler error', error, message);
          await this.sendWithoutEncryptionInto(socket, {
            error: error.message,
          });
          socket.close(1000);
        }
      });

      socket.on('close', () => {
        // TODO: проверить вызывается ли этот метод если мы teminate`нули девайс
        // надо ли вызывать обработчик authorizedClientDisconnectedHandler в двух местах?
        this.callbacks.authedClientOfflineCB(socket.client);
      });
    });
  }

  private async sendWithoutEncryptionInto(
    connection: WebSocketCustomClient,
    document: Record<string, any>,
  ) {
    return new Promise<void>((resolve, reject) => {
      connection.send(JSON.stringify(document), (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  private async firstAuthMesssageHandler(
    socket: WebSocketCustomClient,
    message: RawData,
  ) {
    const parsedMessage = JSON.parse(message.toString());
    console.log('firstAuthMesssageHandler parsedMessage: ', parsedMessage);

    const authorizationResult = await this.callbacks.authRequestCB(
      parsedMessage,
    );

    if (!authorizationResult.isAuthorized)
      throw new Error('Authorization: Crypto worker denied auth');

    socket.isAuthorized = true;
    socket.client = authorizationResult.client;

    socket.on('message', async (message: RawData) => {
      try {
        await this.callbacks.authedMessageCB(message, socket.client);
      } catch (error: any) {
        console.log(
          `Authed message from client ${socket.client.uuid} error`,
          error,
          message,
        );
        await this.sendWithoutEncryptionInto(socket, { error: error.message });
      }
    });
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
  client: model.Client;
  isAuthorized: boolean;
  isAlive: boolean;
}

export interface AuthRequestCB {
  (parsedMessage: AuthMessage): Promise<AuthRequestResult> | AuthRequestResult;
}

export interface AuthedMessageCB {
  (rawEncryptedMessage: RawData, clientSender: model.Client): Promise<any>;
}

export interface OnlineStatusChangedCB {
  (client: model.Client): Promise<any>;
}

export type AuthRequestResult =
  | { isAuthorized: false }
  | {
      isAuthorized: true;
      client: model.Client;
    };
