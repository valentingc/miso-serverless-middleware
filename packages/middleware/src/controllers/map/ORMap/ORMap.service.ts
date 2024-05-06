import { CRDTSetType } from '@miso/common/dist/grpc/server/common.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { ORMap } from '@miso/crdt';
import { StateBasedCRDT } from '@miso/crdt/src/common/StateBasedCRDT.abstract.js';
import { Injectable, Logger } from '@nestjs/common';
import { StatefulObject } from '../../../objects/stateful-object.js';
import { ReplicationService } from '../../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../../utils/controller-utils.js';
import {
  CrdtUtilsService,
  isORMap,
} from '../../../utils/crdt-utils.service.js';
import { jsonMapReplacer } from '../../../utils/json.utils.js';
import { SetService } from '../../set/Set.service.js';

@Injectable()
export class ORMapService {
  protected logger: Logger = new Logger(ORMapService.name);

  constructor(
    private readonly replicationService: ReplicationService,
    private readonly crdtService: CrdtUtilsService,
    private readonly orSetService: SetService,
  ) {}

  get(
    request: miso.middleware.MapGetValueRequest,
    statefulObject: StatefulObject,
  ): miso.middleware.MapValueResponse {
    const key = request.keyString ?? request.keyNumber;
    if (key === undefined) {
      throw new Error('Trying to retrieve undefined key');
    }
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      const valueCrdt = mapCrdt.get(key);

      if (valueCrdt === undefined) {
        const result: miso.middleware.MapValueResponse = {
          keyNumber: request.keyNumber,
          keyString: request.keyString,
          statefulObjectBase: {
            crdtName: crdtName,
            statefulObjectId: statefulObject.id,
          },
          hasValue: false,
        };
        return result;
      }
      const valueCrdtType = this.crdtService.getCrdtTypeForvalue(valueCrdt);
      const valueCrdtName = valueCrdt?.crdtName;

      const result: miso.middleware.MapValueResponse = {
        keyNumber: request.keyNumber,
        keyString: request.keyString,
        statefulObjectBase: {
          crdtName: crdtName,
          statefulObjectId: statefulObject.id,
        },
        hasValue: true,
        valueCrdtName: valueCrdtName,
        valueCrdtType: valueCrdtType ?? CRDTSetType.UNRECOGNIZED,
      };
      return result;
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }

  remove(
    request: miso.middleware.MapDeleteValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.AckResponse {
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }
    const key = request.keyString ?? request.keyNumber;
    if (key === undefined) {
      throw new Error('Trying to remove undefined key');
    }
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      if (mapCrdt.has(key) === false) {
        return { acknowledged: false };
      }
      mapCrdt.delete(key);
      this.logger.debug('ORMap remove key done: ' + key);
      return { acknowledged: true };
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }

  has(
    request: miso.middleware.MapGetValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.BoolResponse {
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }
    const key = request.keyString ?? request.keyNumber;
    if (key === undefined) {
      throw new Error('Trying to check undefined key');
    }
    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      if (mapCrdt.has(key) === false) {
        return { response: false };
      }
      mapCrdt.delete(key);
      this.logger.debug('ORMap has key: ' + key);
      return { response: true };
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }

  keys(
    request: miso.middleware.MapGetKeysRequest,
    statefulObject: StatefulObject,
  ): miso.middleware.MapGetKeysResponse {
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      let response: miso.middleware.MapGetKeysResponse = {
        statefulObjectBase: {
          crdtName: crdtName,
          statefulObjectId: statefulObject.id,
        },
      };

      switch (request.keyType) {
        case miso.common.SetGenericType.NUMBER:
          response = {
            ...response,
            keysNumber: {
              values: Array.from(
                (<ORMap<number, StateBasedCRDT>>mapCrdt).keys(),
              ),
            },
          };

          break;

        case miso.common.SetGenericType.STRING:
          response = {
            ...response,
            keysString: {
              values: Array.from(
                (<ORMap<string, StateBasedCRDT>>mapCrdt).keys(),
              ),
            },
          };
          break;
        case miso.common.SetGenericType.OBJECT:
          response = {
            ...response,
            keysObject: {
              values: Array.from(
                (<ORMap<object, StateBasedCRDT>>mapCrdt).keys(),
              ),
            },
          };
          break;
      }

      return response;
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }

  clear(
    request: miso.middleware.MapClearValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.AckResponse {
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      mapCrdt.clear();
      this.logger.debug('ORMap CLEAR executed');
      return { acknowledged: true };
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }

  set(
    request: miso.middleware.MapSetValueRequest,
    statefulObject: StatefulObject,
  ): miso.middleware.MapValueResponse {
    if (request.valueCrdtName === undefined) {
      throw new Error('Trying to assign undefined valueCrdtName');
    }
    if (
      !request.statefulObjectBase ||
      request.statefulObjectBase?.statefulObjectId === undefined
    ) {
      throw new Error(
        'statefulObjectBase or statefulObjectBase.id is undefined',
      );
    }
    const key = request.keyString ?? request.keyNumber;
    if (key === undefined) {
      throw new Error('Trying to set undefined key');
    }
    if (request.valueCrdtType === CRDTSetType.ORMAP) {
      throw new Error('Nested maps are currently unsupported');
    }

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const mapCrdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      CRDTSetType.ORMAP,
      serverlessFunctionName,
    );
    if (isORMap(mapCrdt)) {
      const valueCrdt = this.crdtService.getOrCreateCrdt(
        statefulObject,
        request.valueCrdtName,
        request.valueCrdtType,
        serverlessFunctionName,
      );

      this.logger.debug(
        'ORMap SET valueCrdt: ' + JSON.stringify(valueCrdt, jsonMapReplacer),
      );
      mapCrdt.set(key, valueCrdt, request.replicaId);

      const valueCrdtType = this.crdtService.getCrdtTypeForvalue(valueCrdt);
      const valueCrdtName = valueCrdt.crdtName;

      if (valueCrdtName === undefined) {
        throw new Error('valueCrdtName is undefined');
      }

      const result: miso.middleware.MapValueResponse = {
        keyNumber: request.keyNumber,
        keyString: request.keyString,
        statefulObjectBase: {
          crdtName: crdtName,
          statefulObjectId: statefulObject.id,
        },
        hasValue: true,
        valueCrdtName,
        valueCrdtType: valueCrdtType ?? CRDTSetType.UNRECOGNIZED,
      };
      this.logger.debug(
        'ORMap SET result: ' + JSON.stringify(result, jsonMapReplacer),
      );
      return result;
    }
    throw new Error('CRDT has the wrong type for ORMap');
  }
}
