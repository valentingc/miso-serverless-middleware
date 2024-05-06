import { ICrdtProxy } from '../ICrdtProxy.js';

export interface IEWFlagProxy extends ICrdtProxy {
  assign(value: boolean): Promise<boolean>;
  getValue(): Promise<boolean>;
}
