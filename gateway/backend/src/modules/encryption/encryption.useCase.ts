import { Inject, Injectable } from '@nestjs/common';
import {
  ENCRYPTION_MODULE_INITIALIZER_KEY,
  EncryptionWorkerStoreFormat,
} from './encryptionModuleInitializer.provider';

@Injectable()
export class EncryptionUseCase {
  constructor(
    @Inject(ENCRYPTION_MODULE_INITIALIZER_KEY)
    initialStore: EncryptionWorkerStoreFormat,
  ) {
    this.store = initialStore;
    console.log('initialStore: ', initialStore);
  }

  getEncryptionWorker(uuid: string) {
    if (!this.store[uuid])
      throw new Error(`There are no encryption worker with uuid={${uuid}}`);
    console.log(uuid, 'passed?');
    return this.store[uuid];
  }

  private store: EncryptionWorkerStoreFormat = Object.create(null);
}
