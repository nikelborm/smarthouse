import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RawData, Server, WebSocket } from 'ws';
import { model } from '../infrastructure';

@Injectable()
export class WebsocketService {
  private readonly server: Server<WebSocketCustomClient>;
  private deadSocketsCleanerInterval: NodeJS.Timer;

  private authRequestCB: AuthRequestCB;
  private authedMessageCB: AuthedMessageCB;
  private authedClientOfflineCB: OnlineStatusChangedCB;

  constructor(config: {
    port: number;
    authRequestCB: AuthRequestCB;
    authedMessageCB: AuthedMessageCB;
    authedClientOfflineCB?: OnlineStatusChangedCB;
  }) {
    this.server = new Server({
      port: config.port,
    });

    this.authRequestCB = config.authRequestCB;
    // Здесь же в этом обработчике нужно написать функционал для трекинга, что вот устройство вышло в онлайн,
    // кто подписан на это событие, тем отправить уведомление, например веб сервер будет подписан на это событие
    this.authedMessageCB = config.authedMessageCB;
    this.authedClientOfflineCB =
      config.authedClientOfflineCB ||
      ((session) => console.log(`Client ${session.uuid} disconnected`));

    this.handleWSconnections();
    this.startDeadSocketCleaning();
  }

  getOnlineClientUUIDs() {
    return [...this.server.clients]
      .filter(({ isAuthorized }) => isAuthorized)
      .map((connection) => connection.session.uuid);
  }

  async sendToClientByUUID(UUID: string, document: Record<string, any>) {
    let wasClientFound = false;
    for (const connection of this.server.clients) {
      if (connection.session.uuid === UUID) {
        await this.sendInto(connection, document);
        wasClientFound = true;
      }
    }
    if (!wasClientFound) throw new Error('Client does not connected to server');
  }

  sendToClientsByIds(UUIDs: string[], document: Record<string, any>) {
    const json = JSON.stringify(document);
    const uuids = new Set(UUIDs);
    for (const connection of this.server.clients) {
      if (uuids.has(connection.session.uuid)) {
        connection.send(json);
      }
    }
  }

  private handleWSconnections() {
    this.server.on('connection', (socket) => {
      socket.isAlive = true;

      socket.on('pong', () => {
        socket.isAlive = true;
      });

      socket.once('message', this.firstClientMessageHandler(socket));
      socket.on('close', () => {
        // TODO: проверить вызывается ли этот метод если мы teminate`нули девайс
        //? надо ли вызывать обработчик authorizedClientDisconnectedHandler в двух местах
        this.authedClientOfflineCB(socket.session);
      });
    });
  }

  private async sendInto(
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

  private firstClientMessageHandler =
    (socket: WebSocketCustomClient) => async (message: RawData) => {
      const parsedMessage = JSON.parse(message.toString());
      const authorizationResult = await this.authRequestCB(parsedMessage);
      if (authorizationResult.isAuthorized) {
        socket.session = authorizationResult.session;
        socket.on('message', async (message: RawData) => {
          const parsedMessage = JSON.parse(message.toString());
          await this.authedMessageCB(parsedMessage, socket.session);
        });
      } else {
        await this.sendInto(socket, {
          error: 'Authorization was unsucessfull',
        });
        socket.close(1000);
      }
    };

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
  session: model.Client;
  isAuthorized: boolean;
  isAlive: boolean;
}

type AuthRequestCB = (
  message: Message,
) => Promise<AuthRequestResult> | AuthRequestResult;

type AuthRequestResult =
  | { isAuthorized: false }
  | {
      isAuthorized: true;
      session: model.Client;
    };

type AuthedMessageCB = (
  message: Message,
  session: model.Client,
) => Promise<any> | any;

type OnlineStatusChangedCB = (session: model.Client) => Promise<any> | any;

type Message = Record<string, any>;
