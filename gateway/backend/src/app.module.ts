import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

import { appConfig, dbConfig } from './config';
import { AccessLogMiddleware } from './tools';

import { InfrastructureModule } from './modules/infrastructure';
import { ClientInitialHandshakeModule } from './modules/clientInitialHandshake';
import { ClientManagementModule } from './modules/clientManagement';
import { EventModule } from './modules/event';
import { EventParameterModule } from './modules/eventParameter';
import { GatewayEndpointsModule } from './modules/gatewayEndpoints';
import { MessagesModule } from './modules/messages';
import { RouteModule } from './modules/route';
import { DataValidatorModule } from './modules/dataValidator';
import { EncryptionModule } from './modules/encryption';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(resolve(), 'build'),
    }),

    ClientInitialHandshakeModule,
    ClientManagementModule,
    DataValidatorModule,
    EncryptionModule,
    EventModule,
    EventParameterModule,
    GatewayEndpointsModule,
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
