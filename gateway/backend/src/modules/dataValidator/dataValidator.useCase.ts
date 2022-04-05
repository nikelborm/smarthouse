import { Injectable } from '@nestjs/common';
import { IDataValidator } from './IDataValidator';
import * as validators from './validators';

@Injectable()
export class DataValidatorUseCase {
  constructor() {
    for (const Validator of Object.values(validators)) {
      const validatorInstance = Object.freeze(new Validator());
      this.store[validatorInstance.uuid] = validatorInstance;
    }
  }

  getValidator(uuid: string) {
    return this.store[uuid];
  }

  private store: {
    [uuid in string]: IDataValidator<any>;
  } = Object.create(null);
}
