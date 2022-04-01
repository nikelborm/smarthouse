import { Module } from '@nestjs/common';
import { RouteUseCase } from './route.useCase';

@Module({
  providers: [RouteUseCase],
  exports: [RouteUseCase],
})
export class RouteModule {}
