import { SetGenericType } from '@miso/common/dist/grpc/server/common.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { MVRegister, VectorClock } from '@miso/crdt';
import { Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { StatefulObject } from '../../objects/stateful-object.js';
import { ReplicationService } from '../../replication/replication.service.js';
import { getStatefulObjectInformation } from '../../utils/controller-utils.js';
import { CrdtType } from '../../utils/crdt-type.enum.js';
import {
  CrdtUtilsService,
  isMVRegister,
} from '../../utils/crdt-utils.service.js';
import { jsonMapReplacer } from '../../utils/json.utils.js';
import { SetUtilsService } from '../../utils/set-utils.service.js';

@Injectable()
export class MVRegisterService {
  protected logger: Logger = new Logger(MVRegisterService.name);

  constructor(
    private readonly replicationService: ReplicationService,
    private readonly setUtilsService: SetUtilsService,
    private readonly crdtService: CrdtUtilsService,
  ) {
    this.merge = this.merge.bind(this);
  }

  private _getCrdt(
    statefulObject: StatefulObject,
    crdtName: string,
    serverlessFunctionName: string,
  ) {
    const crdt = this.crdtService.getOrCreateCrdt(
      statefulObject,
      crdtName,
      miso.common.CRDTSetType.MVREGISTER,
      serverlessFunctionName,
    );
    if (!isMVRegister(crdt)) {
      throw new Error('CRDT has the wrong type');
    }

    return crdt;
  }

  retrieveMVRegister(
    request: miso.common.SetInitRequest,
    statefulObject: StatefulObject,
  ):
    | miso.replication.RetrieveMVRegisterResponse
    | Promise<miso.replication.RetrieveMVRegisterResponse>
    | Observable<miso.replication.RetrieveMVRegisterResponse> {
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

    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      statefulObject.serverlessFunctionName,
    );

    const result: miso.common.SetOrRegisterValueResponse =
      this.setUtilsService.getResult(
        statefulObject,
        crdt,
        request.setGenerictype,
      );
    const payload = this._getUpdatePayload(
      crdt,
      statefulObject,
      request.setGenerictype,
      result,
    );
    return {
      hasValue: {
        response: true,
      },
      value: payload,
    };
  }

  async merge(
    request: miso.replication.MVRegisterUpdate,
    statefulObject: StatefulObject,
  ): Promise<miso.common.SetOrRegisterValueResponse> {
    this.logger.debug(
      'MVRegister MERGE UPDATE REQUEST: ' + JSON.stringify(request),
    );

    const { crdtName, serverlessFunctionName } =
      getStatefulObjectInformation(request);
    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    const srcVectorClockObj = request.vectorClock?.srcVectorClock ?? {};

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

    const srcMVRegister = new MVRegister(
      statefulObject.id,
      crdtName,
      this.setUtilsService.getValuesFromRequest(request),
      srcVectorClock,
    );

    crdt.merge(srcMVRegister);
    this.logger.verbose(
      'Merged CRDT: value: ' +
        crdt.get() +
        ' , json: ' +
        JSON.stringify(crdt, jsonMapReplacer),
    );

    return this.setUtilsService.getResult(statefulObject, crdt, request.type);
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

    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    return this.setUtilsService.getResult(statefulObject, crdt, request.type);
  }

  private _getUpdatePayload(
    crdt: MVRegister<any>,
    statefulObject: StatefulObject,
    setGenericType: SetGenericType,
    result: miso.common.SetOrRegisterValueResponse,
  ) {
    const timeMS = Date.now();
    const update: miso.replication.MVRegisterUpdate = {
      type: setGenericType,

      statefulObjectBase: {
        crdtName: crdt.crdtName,
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
          crdt.getVectorClock().getMapEntries(),
        ),
      },

      valuesNumber: result.valuesNumber,
      valuesObject: result.valuesObject,
      valuesString: result.valuesString,
    };
    return update;
  }
  assign(
    request: miso.middleware.SetOrRegisterSetValueRequest,
    statefulObject: StatefulObject,
  ):
    | miso.common.SetOrRegisterValueResponse
    | Observable<miso.common.SetOrRegisterValueResponse>
    | Promise<miso.common.SetOrRegisterValueResponse> {
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

    const crdt = this._getCrdt(
      statefulObject,
      crdtName,
      serverlessFunctionName,
    );

    crdt.assign(
      request.setValueType === miso.common.SetGenericType.OBJECT
        ? JSON.parse(request.value)
        : request.value,
      request.replicaId,
    );

    const result: miso.common.SetOrRegisterValueResponse =
      this.setUtilsService.getResult(
        statefulObject,
        crdt,
        request.setValueType,
      );

    const update = this._getUpdatePayload(
      crdt,
      statefulObject,
      request.setValueType,
      result,
    );

    this.replicationService.queueReplicationTask({
      crdtName: update.statefulObjectBase?.crdtName ?? 'unknown',
      statefulObjectId:
        update.statefulObjectBase?.statefulObjectId ?? 'unknown',
      crdtType: CrdtType.MVRegister,
      grpcMethod: 'mergeMvRegister',
      payload: update,
      serverlessFunctionName: serverlessFunctionName,
      retryCount: 0,
    });

    result.valuesNumber = undefined;
    result.valuesObject = undefined;
    result.valuesString = undefined;

    return result;
  }
}
