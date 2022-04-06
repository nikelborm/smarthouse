import { isString } from 'class-validator';
import { IDataValidator } from '../IDataValidator';

export class StringDataValidator implements IDataValidator<string> {
  readonly uuid = 'd3718ec1-6a79-4a3c-a7c4-77e7d55acf94';

  readonly name = 'String validator';

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
