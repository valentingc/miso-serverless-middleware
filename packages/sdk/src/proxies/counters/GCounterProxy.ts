import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType.js';
import { GCounterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/GCounterService';
import { PNCounterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/PNCounterService.js';
import { StatefulObjectProxy } from '../../StatefulObjectProxy';
import { ICrdtProxy } from '../ICrdtProxy.js';
import { CounterProxyUtils } from './CounterProxyUtils';
import { IGCounterProxy } from './IGCounterProxy';

export class GCounterProxy implements IGCounterProxy, ICrdtProxy {
  protected utils: CounterProxyUtils | undefined;

  static create(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: GCounterServiceClient | PNCounterServiceClient,
  ) {
    const instance = new GCounterProxy();
    console.log(
      'GCOUNTER CONSTRUCTOR, statefulObject defined? ' +
        (statefulObject !== undefined),
    );
    instance.utils = new CounterProxyUtils(grpcService, {
      crdtName: crdtName,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.GCOUNTER,
    });
    return instance;
  }

  get config() {
    if (this.utils === undefined)
      throw new Error('Instance was not created via #create() factory method');
    return this.utils?.config;
  }
  get type() {
    return 'GCounterProxy';
  }
  getValue(): Promise<number> {
    if (this.utils === undefined)
      throw new Error('Instance was not created via #create() factory method');
    return this.utils.getValue();
  }

  add(value: number): Promise<number> {
    if (this.utils === undefined)
      throw new Error('Instance was not created via #create() factory method');
    return this.utils.add(value);
  }
}
