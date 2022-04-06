import { differenceBetweenSetsInArray } from 'src/tools';
import { repo } from '../infrastructure';
import { IDataValidator } from './IDataValidator';
import * as localValidatorsClasses from './validators';

export const DATA_VALIDATOR_MODULE_INITIALIZER_KEY = Symbol(
  'DataValidatorModuleInitializer',
);

export const DataValidatorModuleInitializer = {
  provide: DATA_VALIDATOR_MODULE_INITIALIZER_KEY,

  useFactory: async (dataValidatorRepo: repo.DataValidatorRepo) => {
    const validatorsStore: DataValidatorStoreFormat = Object.create(null);

    for (const ValidatorClass of Object.values(localValidatorsClasses)) {
      const validatorInstance = Object.freeze(new ValidatorClass());

      if (!validatorInstance.uuid) {
        throw new Error('Found DataValidator without uuid');
      }

      validatorsStore[validatorInstance.uuid] = validatorInstance;
    }

    const validatorUUIDsFromDatabase = new Set(
      (await dataValidatorRepo.getAll()).map(({ uuid }) => uuid),
    );

    const validatorUUIDsFromCode = new Set(Object.keys(validatorsStore));

    const validatorUUIDsNeedToBeImplemented = differenceBetweenSetsInArray(
      validatorUUIDsFromDatabase,
      validatorUUIDsFromCode,
    );

    if (validatorUUIDsNeedToBeImplemented.length)
      throw new Error(
        `Database expects for some DataValidators need to be impelemented.
        Do it as soon as possible because, your devices required for these DataValidators will not work without it`,
      );

    const validatorUUIDsNeedToBeInserted = differenceBetweenSetsInArray(
      validatorUUIDsFromCode,
      validatorUUIDsFromDatabase,
    );

    if (validatorUUIDsNeedToBeInserted.length)
      await dataValidatorRepo.createManyPlain(
        validatorUUIDsNeedToBeInserted.map((uuid) => ({
          name: validatorsStore[uuid].name,
          uuid,
        })),
      );

    return validatorsStore;
  },
  inject: [repo.DataValidatorRepo],
};

export type DataValidatorStoreFormat = {
  [uuid in string]: IDataValidator<any>;
};
