export interface IDataValidator<T> {
  readonly uuid: string;

  verify(value: T): boolean;

  serialize(value: T): string;

  deserialize(value: string): T;
}
