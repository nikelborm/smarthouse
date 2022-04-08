import { ConfigService } from '@nestjs/config';
import {
  AuthedMessageCB,
  AuthRequestCB,
  OnlineStatusChangedCB,
  WebsocketService,
} from './websocket.service';

export const WEBSOCKET_SERVICE_FACTORY_KEY = Symbol('websocketServiceFactory');

export const WebsocketServiceFactory = {
  provide: WEBSOCKET_SERVICE_FACTORY_KEY,
  useFactory: async (configService: ConfigService) => {
    return {
      create: function (config) {
        return new WebsocketService(configService, config);
      },
    } as IWebsocketServiceFactory;
  },
  inject: [ConfigService],
};

export interface IWebsocketServiceFactory {
  create(config: {
    authRequestCB: AuthRequestCB;
    authedMessageCB: AuthedMessageCB;
    authedClientOfflineCB: OnlineStatusChangedCB;
  }): WebsocketService;
}
