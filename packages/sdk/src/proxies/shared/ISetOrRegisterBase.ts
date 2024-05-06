export interface ISetOrRegisterBase<T extends string | number | object> {
  add(value: T): Promise<T[]>;
  getValue(): Promise<T[]>;
}
