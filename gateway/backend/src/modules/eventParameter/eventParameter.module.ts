import { Module } from '@nestjs/common';
import { EventParameterUseCase } from './eventParameter.useCase';

@Module({
  providers: [EventParameterUseCase],
  exports: [EventParameterUseCase],
})
export class EventParameterModule {}
