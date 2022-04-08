import { isString } from 'class-validator';
import { SerializedIntoJsonData, IDataValidator } from '../IDataValidator';

export class StringDataValidator implements IDataValidator<string> {
  readonly uuid = '7f28e4a4-eec8-408f-bf61-a4d7cf734a45';

  readonly name = 'String validator';

  verify(value: SerializedIntoJsonData): boolean {
    return isString(value);
  }

  deserialize(value: SerializedIntoJsonData): string {
    return value;
  }

  serialize(value: string): SerializedIntoJsonData {
    return value;
  }
}
