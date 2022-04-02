import { Injectable } from '@nestjs/common';
import { IEncryptionWorker } from './IEncryptionWorker';
import * as workers from './workers';

@Injectable()
export class EncryptionUseCase {
  constructor() {
    for (const Worker of Object.values(workers)) {
      const workerInstance = Object.freeze(new Worker());
      this.store[workerInstance.uuid] = workerInstance;
    }
  }

  getEncryptionWorker(uuid: string) {
    return this.store[uuid];
  }

  private store: {
    [uuid in string]: IEncryptionWorker<any, any, any>;
  } = Object.create(null);
}
