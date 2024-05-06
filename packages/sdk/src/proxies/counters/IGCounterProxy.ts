import { ICrdtProxy } from '../ICrdtProxy.js';

export interface IGCounterProxy extends ICrdtProxy {
  add(value: number): Promise<number>;
  getValue(): Promise<number>;
}
