import { SerializedIntoJsonData, IDataValidator } from '../IDataValidator';

export class JsonDataValidator implements IDataValidator<string> {
  readonly uuid = '2a07c01f-ebb9-4f47-97e4-be09142e16af';

  readonly name = 'Json validator';

  verify(value: SerializedIntoJsonData): boolean {
    try {
      JSON.parse('' + value);
      return true;
    } catch (error) {
      return false;
    }
  }

  deserialize(value: SerializedIntoJsonData): string {
    return value;
  }

  serialize(value: string): SerializedIntoJsonData {
    return value;
  }
}
