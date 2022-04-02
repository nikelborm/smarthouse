import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appConfig, dbConfig } from './config';
import { AccessLogMiddleware } from './tools';
import { InfrastructureModule } from './modules/infrastructure';
import { join, resolve } from 'path';
import { ClientInitialHandshakeModule } from './modules/clientInitialHandshake';
import { ClientManagementModule } from './modules/clientManagement';
import { EventModule } from './modules/event';
import { EventParameterModule } from './modules/eventParameter';
import { GatewayEndpointsModule } from './modules/gatewayEndpoints';
import { MessagesModule } from './modules/messages';
import { RouteModule } from './modules/route';

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
    InfrastructureModule,
    ClientInitialHandshakeModule,
    ClientManagementModule,
    EventModule,
    EventParameterModule,
    GatewayEndpointsModule,
    MessagesModule,
    RouteModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
