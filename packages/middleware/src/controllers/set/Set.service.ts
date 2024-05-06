import {
  CRDTSetType,
  SetGenericType,
} from '@miso/common/dist/grpc/server/common.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import {
  MVRegisterUpdate,
  ORSetUpdate,
} from '@miso/common/dist/grpc/server/replication.js';
import { GSet, OptORSet, VectorClock } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatefulObject } from '../../objects/stateful-object.js';
import { ReplicationService } from '../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../utils/controller-utils.js';
import { CrdtType } from '../../utils/crdt-type.enum.js';
import {
  CrdtUtilsService,
  isGSet,
  isOptORSet,
} from '../../utils/crdt-utils.service.js';
import { jsonMapReplacer } from '../../utils/json.utils.js';
import { SetUtilsService } from '../../utils/set-utils.service.js';

@Injectable()
export class SetService {
  protected logger: Logger = new Logger(SetService.name);

  constructor(
    private readonly replicationService: ReplicationService,
    private readonly setUtilsService: SetUtilsService,
    private readonly crdtService: CrdtUtilsService,
  ) {
    this.mergeGSet = this.mergeGSet.bind(this);
    this.mergeOrSet = this.mergeOrSet.bind(this);
  }

  retrieveGSet(
    request: miso.common.SetInitRequest,
    statefulObject: StatefulObject,
  ): miso.replication.RetrieveGSetResponse {
    const crdtName = request.statefulObjectBase?.crdtName;
    if (crdtName === undefined) {
      throw new Error('CRDT name is undefined');
    }

    if (statefulObject.hasCrdt(crdtName) === false) {
      this.logger.log(
        'CRDT with the name: ' +
          crdtName +
          ' does not exist in the stateful object with id: ' +
          statefulObject.id,
      );
      return {
        hasValue: {
          response: false,
        },
      };
    }

    const crdt = this._getGSet(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.GSET,
      statefulObject.serverlessFunctionName,
    );

    const result = this.setUtilsService.getResult(
      statefulObject,
      crdt,
      request.setGenerictype,
    );

    const update = this._getUpdatePayload(
      request.crdtSetType,
      request.setGenerictype,
      crdtName,
      statefulObject,
      result,
      crdt,
    );

    return {
      hasValue: {
        response: true,
      },
      value: update,
    };
  }

  retrieveORSet(
    request: miso.common.SetInitRequest,
    statefulObject: StatefulObject,
  ): miso.replication.RetrieveORSetResponse {
    const crdtName = request.statefulObjectBase?.crdtName;
    if (crdtName === undefined) {
      throw new Error('CRDT name is undefined');
    }

    if (statefulObject.hasCrdt(crdtName) === false) {
      this.logger.log(
        'CRDT with the name: ' +
          crdtName +
          ' does not exist in the stateful object with id: ' +
          statefulObject.id,
      );
      return {
        hasValue: {
          response: false,
        },
      };
    }
    const crdt = this._getORSet(
      statefulObject,
      crdtName,
      CRDTSetType.ORSET,
      statefulObject.serverlessFunctionName,
    );

    const timeMS = Date.now();

    const map = (crdt as OptORSet<unknown>).getElements();
    const newMap = new Map<any, miso.common.ReplicaVersion>();
    map.forEach((value, key) => {
      let stringifiedKey = key;
      if (request.setGenerictype === miso.common.SetGenericType.OBJECT) {
        stringifiedKey = JSON.stringify(key);
      }
      newMap.set(stringifiedKey, value);
    });

    const update: miso.replication.ORSetUpdate = {
      type: request.setGenerictype,

      statefulObjectBase: {
        crdtName: crdtName,
        statefulObjectId: statefulObject.id,
      },
      functionBase: {
        serverlessFunctionName: statefulObject.serverlessFunctionName,
      },
      sentAtUtc: {
        seconds: timeMS / 1000,
        nanos: (timeMS % 1000) * 1e6,
      },
      srcCurrentValue: false,
      vectorClock: {
        srcVectorClock: Object.fromEntries(
          (crdt as OptORSet<unknown>).getVectorClock().getMapEntries(),
        ),
      },
      elements: Object.fromEntries(newMap.entries()),
    };
    return {
      hasValue: {
        response: true,
      },
      value: update,
    };
  }
  _getORSet(
    statefulObject: StatefulObject,
    crdtName: string,
    crdtType: miso.common.CRDTSetType,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      crdtType,
      serverlessFunctionName,
    );

    if (!isOptORSet(crdt)) {
      throw new Error('CRDT has the wrong type for OptORSet');
    }
    return crdt;
  }

  _getGSet(
    statefulObject: StatefulObject,
    crdtName: string,
    crdtType: miso.common.CRDTSetType,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      crdtType,
      serverlessFunctionName,
    );

    if (!isGSet(crdt)) {
      throw new Error('CRDT has the wrong type for GSet');
    }
    return crdt;
  }
  getValue(
    request: miso.middleware.SetOrRegisterGetValueRequest,
    statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Promise<miso.common.SetOrRegisterValueResponse>
    | Observable<miso.common.SetOrRegisterValueResponse> {
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

    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      request.crdtType,
      serverlessFunctionName,
    );
    if (isGSet(crdt) || isOptORSet(crdt)) {
      const result = this.setUtilsService.getResult(
        statefulObject,
        crdt,
        request.type,
      );
      return result;
    }
    throw new Error('CRDT has the wrong type for GSet or OptORSet');
  }

  removeOrSet(
    request: miso.middleware.SetOrRegisterSetValueRequest,
    statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Promise<miso.common.SetOrRegisterValueResponse>
    | Observable<miso.common.SetOrRegisterValueResponse> {
    if (request.value === undefined) {
      throw new Error('Trying to assign undefined');
    }
    if (request.crdtType === miso.common.CRDTSetType.GSET) {
      throw new Error('Cannot remove from GSet');
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

    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      request.crdtType,
      serverlessFunctionName,
    );
    if (isOptORSet(crdt)) {
      crdt.remove(
        request.setValueType === miso.common.SetGenericType.OBJECT
          ? this._getParsedObject(request.value)
          : request.value,
      );

      const result = this.setUtilsService.getResult(
        statefulObject,
        crdt,
        request.setValueType,
      );
      this.triggerReplication(request, crdtName, statefulObject, result, crdt);
      return result;
    }
    throw new Error('CRDT has the wrong type for GSet or OptORSet');
  }

  add(
    request: miso.middleware.SetOrRegisterSetValueRequest,
    statefulObject: StatefulObject,
  ): miso.common.SetOrRegisterValueResponse {
    if (request.value === undefined) {
      throw new Error('Trying to assign undefined');
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

    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      request.crdtType,
      serverlessFunctionName,
    );
    if (isGSet(crdt) || isOptORSet(crdt)) {
      crdt.add(
        request.setValueType === miso.common.SetGenericType.OBJECT
          ? this._getParsedObject(request.value)
          : request.value,
        request.replicaId,
      );
      const result = this.setUtilsService.getResult(
        statefulObject,
        crdt,
        request.setValueType,
      );

      this.triggerReplication(request, crdtName, statefulObject, result, crdt);
      return result;
    }
    throw new Error('CRDT has the wrong type for GSet or OptORSet');
  }

  private _getUpdatePayload(
    crdtSetType: CRDTSetType,
    setGenericType: SetGenericType,
    crdtName: string,
    statefulObject: StatefulObject,
    result: miso.common.SetOrRegisterValueResponse,
    crdt: GSet<unknown> | OptORSet<unknown>,
  ) {
    const timeMS = Date.now();
    let update: ORSetUpdate | MVRegisterUpdate;
    switch (crdtSetType) {
      case miso.common.CRDTSetType.GSET:
        update = {
          type: setGenericType,
          statefulObjectBase: {
            crdtName: crdtName,
            statefulObjectId: statefulObject.id,
          },
          functionBase: {
            serverlessFunctionName: statefulObject.serverlessFunctionName,
          },
          sentAtUtc: {
            seconds: timeMS / 1000,
            nanos: (timeMS % 1000) * 1e6,
          },
          srcCurrentValue: false,
          vectorClock: {
            srcVectorClock: {},
          },

          valuesNumber: result.valuesNumber,
          valuesObject: result.valuesObject,
          valuesString: result.valuesString,
        };

        break;
      case miso.common.CRDTSetType.ORSET:
        this.logger.debug('Typeof crdt? ' + typeof crdt);
        const map = (crdt as OptORSet<unknown>).getElements();
        const newMap = new Map<any, miso.common.ReplicaVersion>();
        map.forEach((value, key) => {
          let stringifiedKey = key;
          if (setGenericType === miso.common.SetGenericType.OBJECT) {
            stringifiedKey = JSON.stringify(key);
          }
          newMap.set(stringifiedKey, value);
        });

        const tmp: miso.replication.ORSetUpdate = {
          type: setGenericType,

          statefulObjectBase: {
            crdtName: crdtName,
            statefulObjectId: statefulObject.id,
          },
          functionBase: {
            serverlessFunctionName: statefulObject.serverlessFunctionName,
          },
          sentAtUtc: {
            seconds: timeMS / 1000,
            nanos: (timeMS % 1000) * 1e6,
          },
          srcCurrentValue: false,
          vectorClock: {
            srcVectorClock: Object.fromEntries(
              (crdt as OptORSet<unknown>).getVectorClock().getMapEntries(),
            ),
          },
          elements: Object.fromEntries(newMap.entries()),
        };
        update = tmp;

        break;
      default:
        throw new Error('CRDT type is not supported');
    }
    return update;
  }

  triggerReplication(
    request: miso.middleware.SetOrRegisterSetValueRequest,
    crdtName: string,
    statefulObject: StatefulObject,
    result: miso.common.SetOrRegisterValueResponse,
    crdt: GSet<unknown> | OptORSet<unknown>,
  ) {
    const update:
      | miso.replication.MVRegisterUpdate
      | miso.replication.ORSetUpdate = this._getUpdatePayload(
      request.crdtType,
      request.setValueType,
      crdtName,
      statefulObject,
      result,
      crdt,
    );
    this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: 'valuesNumber' in update ? CrdtType.GSET : CrdtType.ORSET,
      grpcMethod: 'valuesNumber' in update ? 'mergeGSet' : 'mergeOrSet',
      payload: update,
      serverlessFunctionName: statefulObject.serverlessFunctionName,
      retryCount: 0,
    });
  }
  async mergeGSet(
    request: miso.replication.MVRegisterUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.SetOrRegisterValueResponse> {
    this.logger.debug('GSet MERGE UPDATE REQUEST: ' + JSON.stringify(request));

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    if (crdtName === undefined) {
      throw new Error(
        'crdtName is undefined for request: ' +
          JSON.stringify(request, jsonMapReplacer),
      );
    }
    const crdt = this._getGSet(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.GSET,
      serverlessFunctionName,
    );

    const srcGset = new GSet(
      statefulObject.id,
      crdtName,
      this.setUtilsService.getValuesFromRequest(request),
    );

    crdt.merge(srcGset);
    this.logger.verbose(
      'Merged CRDT: value: ' +
        crdt.get() +
        ' , json: ' +
        JSON.stringify(crdt, jsonMapReplacer),
    );

    return this.setUtilsService.getResult(statefulObject, crdt, request.type);
  }
  async mergeOrSet(
    request: miso.replication.ORSetUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.SetOrRegisterValueResponse> {
    this.logger.debug(
      'ORSet MERGE UPDATE REQUEST: ' + JSON.stringify(request, jsonMapReplacer),
    );

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);

    const crdt = this._getORSet(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.ORSET,
      serverlessFunctionName,
    );

    const srcVectorClockObj = request.vectorClock?.srcVectorClock ?? {};
    const srcElementsMapObj = request.elements ?? {};

    if (crdtName === undefined) {
      throw new Error(
        'crdtName is undefined for request: ' +
          JSON.stringify(request, jsonMapReplacer),
      );
    }

    const srcVectorClock: VectorClock = new VectorClock(
      new Map(
        Object.entries(srcVectorClockObj).map(([key, value]) => [
          key,
          Number(value),
        ]),
      ),
    );

    const srcElementsMap: Map<any, miso.common.ReplicaVersion> = new Map(
      Object.entries(srcElementsMapObj).map(([key, value]) => {
        return [
          request.type === miso.common.SetGenericType.OBJECT
            ? JSON.parse(key)
            : key,
          value,
        ];
      }),
    );
    const srcOrSet = new OptORSet(
      statefulObject.id,
      crdtName,
      srcElementsMap,
      srcVectorClock,
    );

    crdt.merge(srcOrSet);
    this.logger.verbose(
      'Merged CRDT: value: ' +
        JSON.stringify(crdt.get(), jsonMapReplacer) +
        ' , json: ' +
        JSON.stringify(crdt, jsonMapReplacer),
    );

    return this.setUtilsService.getResult(statefulObject, crdt, request.type);
  }

  private _getParsedObject(value: string) {
    const parsedObject = JSON.parse(value);
    if (parsedObject === undefined) {
      throw new Error('Could not parse value as object');
    }
    if (!('id' in parsedObject)) {
      throw new Error('Need to have the id property set to delete objects');
    }
    return parsedObject;
  }
}
