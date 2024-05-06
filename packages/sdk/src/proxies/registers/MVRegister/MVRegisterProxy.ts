import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
import { SetOrRegisterValueResponse } from '@miso/common/dist/grpc/client/miso/common/SetOrRegisterValueResponse';
import { MVRegisterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/MVRegisterService';
import { StatefulObjectProxy } from '../../../StatefulObjectProxy';
import { ICrdtProxy } from '../../ICrdtProxy.js';
import { handleSetOrRegisterGrpcResponse } from '../../shared/SetAndRegisterUtils';
import { RegisterProxyUtils } from '../RegisterProxyUtils';
import { IMVRegisterProxy } from './IMVRegisterProxy';

export class MVRegisterProxy<T extends string | number | object>
  implements IMVRegisterProxy<T>, ICrdtProxy
{
  protected utils: RegisterProxyUtils | undefined;
  private response: SetOrRegisterValueResponse | undefined = undefined;
  public setGenericType: SetGenericType | undefined;

  static create<T extends string | number | object>(
    crdtName: string,
    statefulObject: StatefulObjectProxy,
    grpcService: MVRegisterServiceClient,
  ) {
    const instance = new MVRegisterProxy<T>();
    instance.utils = new RegisterProxyUtils(grpcService, {
      crdtName: crdtName,
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.MVREGISTER,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
    });

    return instance;
  }
  get type() {
    return 'MVRegisterProxy';
  }
  get config() {
    if (this.utils === undefined) {
      throw new Error('Instance was not created via #create() factory method');
    }
    return this.utils.config;
  }
  async assign(value: T): Promise<T[]> {
    if (this.utils === undefined) {
      throw new Error('Instance was not created via #create() factory method');
    }
    if (value instanceof Number || typeof value === 'number') {
      this.setGenericType = SetGenericType.NUMBER;
    } else if (value instanceof String || typeof value === 'string') {
      this.setGenericType = SetGenericType.STRING;
    } else if (value instanceof Object || typeof value === 'object') {
      this.setGenericType = SetGenericType.OBJECT;
    } else {
      throw new Error('Unrecognized generic type');
    }
    this.response = await this.utils.assign(value, this.setGenericType);
    return handleSetOrRegisterGrpcResponse(this.response);
  }
  async getValue(): Promise<T[]> {
    if (this.utils === undefined) {
      throw new Error('Instance was not created via #create() factory method');
    }
    if (this.setGenericType === undefined) {
      this.setGenericType = SetGenericType.STRING;
    }
    this.response = await this.utils.getValue(this.setGenericType);
    return handleSetOrRegisterGrpcResponse(this.response);
  }
}
