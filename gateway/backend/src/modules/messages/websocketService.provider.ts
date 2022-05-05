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
    let service: WebsocketService;
    return {
      create: function (config) {
        if (service) return service;
        service = new WebsocketService(configService, config);
        return service;
      },
      get: function () {
        return service;
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
  get(): WebsocketService;
}
