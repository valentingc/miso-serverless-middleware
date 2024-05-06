import { ICrdtProxy } from '../../ICrdtProxy.js';
import { ISetOrRegisterBase } from '../../shared/ISetOrRegisterBase';

export interface IORSetProxy<T extends string | number | object>
  extends Pick<ISetOrRegisterBase<T>, keyof ISetOrRegisterBase<T>>,
    ICrdtProxy {
  remove(value: T): Promise<T[]>;
}
