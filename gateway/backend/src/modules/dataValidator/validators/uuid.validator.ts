import { isUUID } from 'class-validator';
import { SerializedIntoJsonData, IDataValidator } from '../IDataValidator';

export class UUIDDataValidator implements IDataValidator<string> {
  readonly uuid = '55912e8f-dcf8-4e8a-8816-a0e33c4c4366';

  readonly name = 'UUID validator';

  verify(value: SerializedIntoJsonData): boolean {
    return isUUID(value);
  }

  deserialize(value: SerializedIntoJsonData): string {
    return value;
  }

  serialize(value: string): SerializedIntoJsonData {
    return value;
  }
}
