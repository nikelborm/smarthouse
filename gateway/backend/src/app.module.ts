import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { appConfig, dbConfig } from './config';
import { AccessLogMiddleware } from './tools';
import { UserModule } from './modules/user';
import { InfrastructureModule } from './modules/infrastructure';
import { join, resolve } from 'path';

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
    UserModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AccessLogMiddleware).forRoutes('*');
  }
}
