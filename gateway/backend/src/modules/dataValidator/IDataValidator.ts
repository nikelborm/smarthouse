export type SerializedIntoJsonData = any;

export interface IDataValidator<T> {
  readonly uuid: string;

  readonly name: string;

  verify(value: T): boolean;

  serialize(value: T): string;

  deserialize(value: string): T;
}
