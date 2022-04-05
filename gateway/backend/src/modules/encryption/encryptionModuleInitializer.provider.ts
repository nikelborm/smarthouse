import { differenceBetweenSetsInArray } from 'src/tools';
import { repo } from '../infrastructure';
import { IEncryptionWorker } from './IEncryptionWorker';
import * as localWorkersClasses from './workers';

export const ENCRYPTION_MODULE_INITIALIZER_KEY = Symbol(
  'encryptionModuleInitializer',
);

export const EncryptionModuleInitializer = {
  provide: ENCRYPTION_MODULE_INITIALIZER_KEY,
  useFactory: async (encryptionWorkerRepo: repo.EncryptionWorkerRepo) => {
    const workersStore: EncryptionWorkerStoreFormat = Object.create(null);

    for (const Worker of Object.values(localWorkersClasses)) {
      const workerInstance = Object.freeze(new Worker());

      if (!workerInstance.uuid) {
        throw new Error('Found encryption worker without uuid');
      }

      workersStore[workerInstance.uuid] = workerInstance;
    }

    const encryptionWorkerUUIDsFromDatabase = new Set(
      (await encryptionWorkerRepo.getAll()).map(({ uuid }) => uuid),
    );

    const encryptionWorkerUUIDsFromCode = new Set(Object.keys(workersStore));

    const workerUUIDsNeedToBeImplemented = differenceBetweenSetsInArray(
      encryptionWorkerUUIDsFromDatabase,
      encryptionWorkerUUIDsFromCode,
    );

    if (workerUUIDsNeedToBeImplemented.length)
      throw new Error(
        `Database expects for some encryption workers need to be impelemented.
        Do it as soon as possible because, your devices required for these workers will not work without it`,
      );

    const workerUUIDsNeedToBeInserted = differenceBetweenSetsInArray(
      encryptionWorkerUUIDsFromCode,
      encryptionWorkerUUIDsFromDatabase,
    );

    if (workerUUIDsNeedToBeInserted.length)
      await encryptionWorkerRepo.createManyPlain(
        workerUUIDsNeedToBeInserted.map((uuid) => ({
          name: workersStore[uuid].name,
          uuid,
        })),
      );
  },
  inject: [repo.EncryptionWorkerRepo],
};

export type EncryptionWorkerStoreFormat = {
  [uuid in string]: IEncryptionWorker<any, any, any>;
};
