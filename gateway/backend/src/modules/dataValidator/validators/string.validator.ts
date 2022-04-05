import { isString } from 'class-validator';
import { IDataValidator } from '../IDataValidator';

export class StringDataValidator implements IDataValidator<string> {
  uuid = 'ca4e23ec-f2a4-4d78-aa94-2065d72d5824';

  verify(value: string): boolean {
    return isString(value);
  }

  deserialize(value: string): string {
    return value;
  }

  serialize(value: string): string {
    return value;
  }
}
