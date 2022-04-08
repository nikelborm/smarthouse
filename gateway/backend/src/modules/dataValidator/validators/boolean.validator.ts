import { isBoolean } from 'class-validator';
import { SerializedIntoJsonData, IDataValidator } from '../IDataValidator';

export class BooleanDataValidator implements IDataValidator<boolean> {
  readonly uuid = '930877ce-d692-4ae1-a1db-580ae6546c36';

  readonly name = 'Boolean validator';

  verify(value: SerializedIntoJsonData): boolean {
    return isBoolean(value);
  }

  deserialize(value: SerializedIntoJsonData): boolean {
    return value === 'true';
  }

  serialize(value: boolean): SerializedIntoJsonData {
    return '' + value;
  }
}
