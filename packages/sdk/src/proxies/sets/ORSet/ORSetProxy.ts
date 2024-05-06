import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType.js';
import { SetOrRegisterValueResponse } from '@miso/common/dist/grpc/client/miso/common/SetOrRegisterValueResponse';
import { SetOrRegisterSetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/SetOrRegisterSetValueRequest';
import { SetServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/SetService';
import { StatefulObjectProxy } from '../../../StatefulObjectProxy';
import { ICrdtProxy } from '../../ICrdtProxy.js';
import {
  getPayloadForSetOrRegisterSetValueRequest,
  makeGrpcCall,
} from '../../shared/GrpcCall';
import { handleSetOrRegisterGrpcResponse } from '../../shared/SetAndRegisterUtils';
import { GSetProxy } from '../GSet/GSetProxy';
import { IORSetProxy } from './IORSetProxy';

export class ORSetProxy<T extends string | number | object>
  extends GSetProxy<T>
  implements IORSetProxy<T>, ICrdtProxy
{
  static create<T extends string | number | object>(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: SetServiceClient,
  ) {
    const instance = new ORSetProxy<T>();
    instance.grpcService = grpcService;
    instance.config = {
      crdtName: crdtName,
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.ORSET,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
    };
    return instance;
  }

  get type() {
    return 'ORSetProxy';
  }

  async remove(value: T): Promise<T[]> {
    if (value instanceof Number || typeof value === 'number') {
      this.setGenericType = SetGenericType.NUMBER;
    } else if (value instanceof String || typeof value === 'string') {
      this.setGenericType = SetGenericType.STRING;
    } else if (value instanceof Object || typeof value === 'object') {
      this.setGenericType = SetGenericType.OBJECT;
    } else {
      throw new Error('Unrecognized generic type');
    }
    const payload: SetOrRegisterSetValueRequest =
      getPayloadForSetOrRegisterSetValueRequest(
        value,
        this.setGenericType,
        this.config,
      );

    const response = await makeGrpcCall<
      SetOrRegisterSetValueRequest,
      SetOrRegisterValueResponse
    >((payload: any, callback: (err: any, response: any) => void) => {
      if (this.grpcService === undefined) {
        throw new Error(
          'Instance was not created via #create() factory method',
        );
      }
      this.grpcService.removeOrSet(payload, callback);
    }, payload);

    return handleSetOrRegisterGrpcResponse(response);
  }
}
