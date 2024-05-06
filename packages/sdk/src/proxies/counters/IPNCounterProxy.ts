import { IGCounterProxy } from './IGCounterProxy';

export interface IPNCounterProxy extends IGCounterProxy {
  subtract(value: number): Promise<number>;
}
