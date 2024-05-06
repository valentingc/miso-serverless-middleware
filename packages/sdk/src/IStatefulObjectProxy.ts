import * as grpc from '@grpc/grpc-js';
import { ICrdtProxy } from './proxies/ICrdtProxy';
import { PNCounterProxy } from './proxies/counters/PNCounterProxy';
import { EWFlagProxy } from './proxies/flag/EWFlagProxy';
import { MVRegisterProxy } from './proxies/registers/MVRegister/MVRegisterProxy';
import { GSetProxy } from './proxies/sets/GSet/GSetProxy';
import { ORSetProxy } from './proxies/sets/ORSet/ORSetProxy';

export interface IStatefulObjectProxy {
  id(): string;
  getCrdts(): Map<string, ICrdtProxy>;
  getPNCounter(name: string): PNCounterProxy;
  getMVRegister<T extends string | number | object>(
    name: string,
  ): MVRegisterProxy<T>;
  getORSet<T extends string | number | object>(name: string): ORSetProxy<T>;
  getGSet<T extends string | number | object>(name: string): GSetProxy<T>;
  getEWFlag(name: string): EWFlagProxy;
  getChannel(): grpc.Channel | undefined;
}
