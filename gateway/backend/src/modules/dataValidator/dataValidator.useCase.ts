import { Inject, Injectable } from '@nestjs/common';
import {
  DataValidatorStoreFormat,
  DATA_VALIDATOR_MODULE_INITIALIZER_KEY,
} from './dataValidatorModuleInitializer.provider';

@Injectable()
export class DataValidatorUseCase {
  constructor(
    @Inject(DATA_VALIDATOR_MODULE_INITIALIZER_KEY)
    initialStore: DataValidatorStoreFormat,
  ) {
    this.store = initialStore;
    console.log('DataValidatorUseCase initialStore: ', initialStore);
  }

  getValidator(uuid: string) {
    return this.store[uuid];
  }

  private store: DataValidatorStoreFormat = Object.create(null);
}
