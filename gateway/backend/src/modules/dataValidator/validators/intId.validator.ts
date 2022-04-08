import { isPositive } from 'class-validator';
import { SerializedIntoJsonData, IDataValidator } from '../IDataValidator';

export class IntIdDataValidator implements IDataValidator<number> {
  readonly uuid = 'dafb84cc-8e4d-45a2-9dac-41067be67b89';

  readonly name = 'Int identifier validator';

  verify(value: SerializedIntoJsonData): boolean {
    return isPositive(value);
  }

  deserialize(value: SerializedIntoJsonData): number {
    return value;
  }

  serialize(value: number): SerializedIntoJsonData {
    return value;
  }
}
