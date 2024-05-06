import { ICrdtProxy } from '../../ICrdtProxy.js';
import { ISetOrRegisterBase } from '../../shared/ISetOrRegisterBase';

export interface IMVRegisterProxy<T extends string | number | object>
  extends Pick<
      ISetOrRegisterBase<T>,
      Exclude<keyof ISetOrRegisterBase<T>, 'add'>
    >,
    ICrdtProxy {
  assign(value: T): Promise<T[]>;
}
