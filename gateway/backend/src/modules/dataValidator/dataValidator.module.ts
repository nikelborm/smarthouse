import { Module } from '@nestjs/common';
import { DataValidatorUseCase } from './dataValidator.useCase';

@Module({
  providers: [DataValidatorUseCase],
  exports: [DataValidatorUseCase],
})
export class DataValidatorModule {}
