import { Module } from '@nestjs/common';
import { DataValidatorUseCase } from './dataValidator.useCase';
import { DataValidatorModuleInitializer } from './dataValidatorModuleInitializer.provider';

@Module({
  providers: [DataValidatorUseCase, DataValidatorModuleInitializer],
  exports: [DataValidatorUseCase],
})
export class DataValidatorModule {}
