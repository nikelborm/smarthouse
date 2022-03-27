import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MockDataUseCase } from './mockData.useCase';
import { MockDataController } from './mockData.controller';

import { UserModule } from 'src/modules/user';
import { InfrastructureModule } from 'src/modules/infrastructure';
import { appConfig, dbConfig } from 'src/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, dbConfig],
    }),
    InfrastructureModule,

    UserModule,
  ],
  providers: [MockDataUseCase],
  controllers: [MockDataController],
})
export class AppModule {}
