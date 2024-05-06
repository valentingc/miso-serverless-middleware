import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';
import { SetOrRegisterValueResponse } from '@miso/common/dist/grpc/client/miso/common/SetOrRegisterValueResponse';
import { MVRegisterServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/MVRegisterService';
import { SetOrRegisterGetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/SetOrRegisterGetValueRequest';
import { Logger } from 'winston';
import { ICrdtProxy } from '../ICrdtProxy.js';
import { getPayloadForSetOrRegisterSetValueRequest } from '../shared/GrpcCall';
import { createLoggingInstance } from '../shared/LoggingUtils';
export class RegisterProxyUtils implements Pick<ICrdtProxy, 'config'> {
  private logger: Logger;
  config: {
    crdtName: string;
    replicaId: string;
    statefulObjectId: string;
    crdtSetType: CRDTSetType;
    serverlessFunctionName: string;
  };
  constructor(
    private grpcService: MVRegisterServiceClient,
    config: {
      crdtName: string;
      replicaId: string;
      statefulObjectId: string;
      crdtSetType: CRDTSetType;
      serverlessFunctionName: string;
    },
  ) {
    this.config = config;
    this.logger = createLoggingInstance(RegisterProxyUtils);
  }

  async assign(
    value: string | number | object,
    setGenericType: SetGenericType,
  ): Promise<SetOrRegisterValueResponse> {
    const payload = getPayloadForSetOrRegisterSetValueRequest(
      value,
      setGenericType,
      this.config,
    );
    this.logger.debug(
      'PAYLOAD BEFORE GRPC CALL assign: ' + JSON.stringify(payload),
    );
    return new Promise<SetOrRegisterValueResponse>((resolve, reject) =>
      this.grpcService.assign(payload, (err, response) => {
        if (err) {
          return reject(err);
        }
        this.logger.debug('GRPC RESPONSE: ' + JSON.stringify(response));
        if (response === undefined) {
          throw new Error('No response');
        }
        resolve(response);
      }),
    );
  }
  async getValue(type: SetGenericType): Promise<SetOrRegisterValueResponse> {
    const payload: SetOrRegisterGetValueRequest = {
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      crdtType: CRDTSetType.MVREGISTER,
      type: type,
      replicaId: this.config.replicaId,
    };

    this.logger.debug(
      'PAYLOAD BEFORE GRPC CALL getValue: ' + JSON.stringify(payload),
    );
    return new Promise<SetOrRegisterValueResponse>((resolve, reject) =>
      this.grpcService.getValue(payload, (err, response) => {
        if (err) {
          return reject(err);
        }
        this.logger.debug('GRPC RESPONSE: ' + JSON.stringify(response));
        if (response === undefined) {
          throw new Error('No response');
        }
        resolve(response);
      }),
    );
  }
}
