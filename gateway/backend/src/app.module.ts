import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfig, dbConfig } from './config';
import { AccessLogMiddleware } from './tools';

import {
  InfrastructureModule,
  ClientInitialHandshakeModule,
  ClientManagementModule,
  EventModule,
  EventParameterModule,
  GatewayAsClientModule,
  MessagesModule,
  RouteModule,
  DataValidatorModule,
  EncryptionModule,
} from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),

    ClientInitialHandshakeModule,
    ClientManagementModule,
    DataValidatorModule,
    EncryptionModule,
    EventModule,
    EventParameterModule,
    GatewayAsClientModule,
    InfrastructureModule,
    MessagesModule,
    RouteModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
