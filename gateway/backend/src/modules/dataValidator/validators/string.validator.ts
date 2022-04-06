import { isString } from 'class-validator';
import { IDataValidator } from '../IDataValidator';

export class StringDataValidator implements IDataValidator<string> {
  readonly uuid = '7f28e4a4-eec8-408f-bf61-a4d7cf734a45';

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
