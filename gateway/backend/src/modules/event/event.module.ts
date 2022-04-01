import { Module } from '@nestjs/common';
import { EventUseCase } from './event.useCase';

@Module({
  providers: [EventUseCase],
  exports: [EventUseCase],
})
export class EventModule {}
