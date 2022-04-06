import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MockDataUseCase } from './mockData.useCase';
import { MockDataController } from './mockData.controller';

import { appConfig, dbConfig } from 'src/config';
import { AccessLogMiddleware } from 'src/tools';

import {
  InfrastructureModule,
  ClientInitialHandshakeModule,
  ClientManagementModule,
  EventModule,
  EventParameterModule,
  GatewayEndpointsModule,
  MessagesModule,
  RouteModule,
  DataValidatorModule,
  EncryptionModule,
} from 'src/modules';

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
    GatewayEndpointsModule,
    InfrastructureModule,
    MessagesModule,
    RouteModule,
  ],
  providers: [MockDataUseCase],
  controllers: [MockDataController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
