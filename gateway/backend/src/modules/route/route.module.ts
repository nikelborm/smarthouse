import { Module } from '@nestjs/common';
import { MessagesModule } from '../messages';
import { RouteUseCase } from './route.useCase';

@Module({
  imports: [MessagesModule],
  providers: [RouteUseCase],
  exports: [RouteUseCase],
})
export class RouteModule {}
