import { CRDTSetType } from '@miso/common/dist/grpc/client/miso/common/CRDTSetType';
import { SetGenericType } from '@miso/common/dist/grpc/client/miso/common/SetGenericType';

import { AckResponse } from '@miso/common/dist/grpc/client/miso/common/AckResponse.js';
import { MapDeleteValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/MapDeleteValueRequest.js';
import { MapGetKeysRequest } from '@miso/common/dist/grpc/client/miso/middleware/MapGetKeysRequest.js';
import { MapGetKeysResponse } from '@miso/common/dist/grpc/client/miso/middleware/MapGetKeysResponse.js';
import { MapGetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/MapGetValueRequest.js';
import { MapSetValueRequest } from '@miso/common/dist/grpc/client/miso/middleware/MapSetValueRequest.js';
import { MapValueResponse } from '@miso/common/dist/grpc/client/miso/middleware/MapValueResponse.js';
import { ORMapServiceClient } from '@miso/common/dist/grpc/client/miso/middleware/ORMapService.js';
import { Logger } from 'winston';
import { StatefulObjectProxy } from '../../StatefulObjectProxy.js';
import { ICrdtProxy } from '../ICrdtProxy.js';
import { GCounterProxy } from '../counters/GCounterProxy.js';
import { PNCounterProxy } from '../counters/PNCounterProxy.js';
import { EWFlagProxy } from '../flag/EWFlagProxy.js';
import { MVRegisterProxy } from '../registers/MVRegister/MVRegisterProxy.js';
import { GSetProxy } from '../sets/GSet/GSetProxy.js';
import { ORSetProxy } from '../sets/ORSet/ORSetProxy.js';
import { makeGrpcCall } from '../shared/GrpcCall.js';
import { createLoggingInstance } from '../shared/LoggingUtils.js';
import { jsonMapReplacer } from '../shared/utils.js';

/*
 This data type is still unfinished!
*/
export class ORMapProxy<
  K extends string | number,
  V extends
    | GCounterProxy
    | PNCounterProxy
    | EWFlagProxy
    | MVRegisterProxy<K>
    | GSetProxy<K>
    | ORSetProxy<K>
    | ORMapProxy<K, V>,
> implements ICrdtProxy
{
  private logger: Logger;
  protected keyType: SetGenericType = SetGenericType.STRING;
  config: {
    crdtName: string;
    replicaId: string;
    statefulObjectId: string;
    crdtSetType: CRDTSetType;
    serverlessFunctionName: string;
  };
  private keyConstructor: () => K;
  private valueConstructor: { new (...args: any[]): V };
  constructor(
    crdtName: string,
    private statefulObject: StatefulObjectProxy,
    protected grpcService: ORMapServiceClient,
    types: { key: () => K; value: new (...args: any[]) => V },
  ) {
    this.config = {
      crdtName: crdtName,
      replicaId: statefulObject.config.replicaId,
      statefulObjectId: statefulObject.id(),
      crdtSetType: CRDTSetType.ORMAP,
      serverlessFunctionName: statefulObject.serverlessFunctionName(),
    };
    this.keyConstructor = types.key;
    this.valueConstructor = types.value;
    this.logger = createLoggingInstance(ORMapProxy);
    const keyInstance = this.keyConstructor();
    if (typeof keyInstance === 'string') {
      this.logger.debug('Key type is string');
      this.keyType = SetGenericType.STRING;
    } else if (typeof keyInstance === 'number') {
      this.logger.debug('Key type is number');
      this.keyType = SetGenericType.NUMBER;
    } else if (typeof keyInstance === 'object') {
      this.logger.debug('Key type is object');
      this.keyType = SetGenericType.OBJECT;
    }
  }

  get type() {
    return 'ORMapProxy';
  }

  private _getValueCrdtType(value: V) {
    typeof value;

    if (value instanceof PNCounterProxy) {
      return CRDTSetType.PNCOUNTER;
    } else if (value instanceof GCounterProxy) {
      return CRDTSetType.GCOUNTER;
    } else if (value instanceof EWFlagProxy) {
      return CRDTSetType.EWFLAG;
    } else if (value instanceof MVRegisterProxy) {
      return CRDTSetType.MVREGISTER;
    } else if (value instanceof GSetProxy) {
      return CRDTSetType.GSET;
    } else if (value instanceof ORSetProxy) {
      return CRDTSetType.ORSET;
    } else {
      throw new Error('Unrecognized generic type');
    }
  }

  async delete(key: K): Promise<AckResponse> {
    const payload: MapDeleteValueRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      keyNumber: Number(key),
      keyString: String(key),
    };
    const response = await makeGrpcCall<MapDeleteValueRequest, AckResponse>(
      (payload: any, callback: (err: any, response: any) => void) => {
        this.grpcService.set(payload, callback);
      },
      payload,
    );
    return response;
  }

  async set(key: K, value: V): Promise<MapValueResponse> {
    const payload: MapSetValueRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      replicaId: this.config.replicaId,
      valueCrdtType: this._getValueCrdtType(value),
      valueCrdtName: value.config.crdtName,
      keyNumber: Number(key),
      keyString: String(key),
    };

    const response = await makeGrpcCall<MapSetValueRequest, MapValueResponse>(
      (payload: any, callback: (err: any, response: any) => void) => {
        this.grpcService.set(payload, callback);
      },
      payload,
    );
    return response;
  }

  async keys(): Promise<K[]> {
    const payload: MapGetKeysRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      keyType: this.keyType,
    };
    const response = await makeGrpcCall<MapGetKeysRequest, MapGetKeysResponse>(
      (payload: any, callback: (err: any, response: any) => void) => {
        this.grpcService.keys(payload, callback);
      },
      payload,
    );

    switch (this.keyType) {
      case SetGenericType.STRING:
        return response.keysString?.values as K[];
      case SetGenericType.NUMBER:
        return response.keysNumber?.values as K[];
      case SetGenericType.OBJECT:
        return response.keysObject?.values as K[];
      default:
        throw new Error('Unrecognized generic type');
    }
  }
  async get(key: K): Promise<V | undefined> {
    const keyInstance = this.keyConstructor();
    const valueInstance = new this.valueConstructor();

    console.log(
      'keyinstance? ' +
        typeof keyInstance +
        ' -- ' +
        (keyInstance instanceof this.keyConstructor),
    );
    console.log(
      'valueInstance? ' +
        typeof valueInstance +
        ' -- ' +
        (valueInstance instanceof this.valueConstructor),
    );

    const payload: MapGetValueRequest = {
      functionBase: {
        serverlessFunctionName: this.config.serverlessFunctionName,
      },
      statefulObjectBase: {
        crdtName: this.config.crdtName,
        statefulObjectId: this.config.statefulObjectId,
      },
      keyNumber: Number(key),
      keyString: String(key),
    };

    const response = await makeGrpcCall<MapGetValueRequest, MapValueResponse>(
      (payload: any, callback: (err: any, response: any) => void) => {
        this.grpcService.get(payload, callback);
      },
      payload,
    );

    this.logger.info(
      'ORMapProxy GET for key: ' +
        key +
        ' - value: ' +
        JSON.stringify(response, jsonMapReplacer),
    );
    if (response.hasValue === false) {
      this.logger.info('No value found for key: ' + key);
      return undefined;
    }

    if (response.valueCrdtType === CRDTSetType.PNCOUNTER) {
      return this.statefulObject.getPNCounter(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else if (response.valueCrdtType === CRDTSetType.GCOUNTER) {
      return this.statefulObject.getGCounter(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else if (response.valueCrdtType === CRDTSetType.EWFLAG) {
      return this.statefulObject.getEWFlag(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else if (response.valueCrdtType === CRDTSetType.MVREGISTER) {
      return this.statefulObject.getMVRegister<K>(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else if (response.valueCrdtType === CRDTSetType.GSET) {
      return this.statefulObject.getGSet<K>(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else if (response.valueCrdtType === CRDTSetType.ORSET) {
      return this.statefulObject.getORSet<K>(
        response.valueCrdtName ?? 'undefined',
      ) as V;
    } else {
      throw new Error('Unrecognized CRDT type for value');
    }
  }
}
