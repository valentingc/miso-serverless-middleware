import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType.js';
import { PNCounterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/PNCounterService';
import { StatefulObjectProxy } from '../../StatefulObjectProxy';
import { ICrdtProxy } from '../ICrdtProxy';
import { CounterProxyUtils } from './CounterProxyUtils.js';
import { GCounterProxy } from './GCounterProxy';
import { IPNCounterProxy } from './IPNCounterProxy';

export class PNCounterProxy
  extends GCounterProxy
  implements ICrdtProxy, IPNCounterProxy
{
  static create(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: PNCounterServiceClient,
  ) {
    const instance = new PNCounterProxy();

    instance.utils = new CounterProxyUtils(grpcService, {
      crdtName: crdtName,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.PNCOUNTER,
    });

    return instance;
  }

  get config() {
    if (this.utils === undefined)
      throw new Error('Instance was not created via #create() factory method');
    return this.utils?.config;
  }

  get type() {
    return 'PNCounterProxy';
  }

  async subtract(value: number): Promise<number> {
    if (this.utils === undefined)
      throw new Error('Instance was not created via #create() factory method');
    return this.utils.subtract(value);
  }
}
