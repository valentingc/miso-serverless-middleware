import { CRDTSetType } from '@miso/common/dist/grpc/server/common.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import {
  EnableWinsFlag,
  GCounter,
  GSet,
  MVRegister,
  ORMap,
  OptORSet,
  PNCounter,
} from '@miso/crdt';
import { StateBasedCRDT } from '@miso/crdt/src/common/StateBasedCRDT.abstract.js';
import { Injectable, Logger } from '@nestjs/common';
import { StatefulObject } from '../objects/stateful-object.js';

export function isOptORSet(value: any): value is OptORSet<any> {
  return value instanceof OptORSet;
}

export function isGSet(value: any): value is GSet<any> {
  return value instanceof GSet;
}

export function isORMap(value: any): value is ORMap<any, any> {
  return value instanceof ORMap;
}

export function isGCounter(value: any): value is GCounter {
  return value instanceof GCounter;
}

export function isPNCounter(value: any): value is PNCounter {
  return value instanceof PNCounter;
}

export function isEWFlag(value: any): value is EnableWinsFlag {
  return value instanceof EnableWinsFlag;
}

export function isMVRegister(value: any): value is MVRegister<any> {
  return value instanceof MVRegister;
}

@Injectable()
export class CrdtUtilsService {
  private logger: Logger = new Logger(CrdtUtilsService.name);

  getCrdtTypeForvalue(valueCrdt: StateBasedCRDT) {
    let valueCrdtType;
    if (valueCrdt instanceof PNCounter) {
      valueCrdtType = CRDTSetType.PNCOUNTER;
    } else if (valueCrdt instanceof GCounter) {
      valueCrdtType = CRDTSetType.GCOUNTER;
    } else if (valueCrdt instanceof EnableWinsFlag) {
      valueCrdtType = CRDTSetType.EWFLAG;
    } else if (valueCrdt instanceof MVRegister) {
      valueCrdtType = CRDTSetType.MVREGISTER;
    } else if (valueCrdt instanceof OptORSet) {
      valueCrdtType = CRDTSetType.ORSET;
    } else if (valueCrdt instanceof GSet) {
      valueCrdtType = CRDTSetType.GSET;
    } else {
      throw new Error('Unrecognized CRDT type for value');
    }
    return valueCrdtType;
  }

  getOrCreateCrdt<K extends number | string | object, V extends StateBasedCRDT>(
    statefulObject: StatefulObject,
    crdtName: string,
    crdtType: miso.common.CRDTSetType,
    serverlessFunctionName: string,
    doNotCreate = false,
  ) {
    let crdt;
    if (statefulObject.hasCrdt(crdtName)) {
      if (crdtType === miso.common.CRDTSetType.ORSET) {
        crdt = statefulObject.getCrdt<OptORSet<unknown>>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.GSET) {
        crdt = statefulObject.getCrdt<GSet<unknown>>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.MVREGISTER) {
        crdt = statefulObject.getCrdt<MVRegister<unknown>>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.EWFLAG) {
        crdt = statefulObject.getCrdt<EnableWinsFlag>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.GCOUNTER) {
        crdt = statefulObject.getCrdt<GCounter>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.PNCOUNTER) {
        crdt = statefulObject.getCrdt<PNCounter>(crdtName);
      } else if (crdtType === miso.common.CRDTSetType.ORMAP) {
        crdt = statefulObject.getCrdt<ORMap<K, V>>(crdtName);
      } else {
        throw new Error('Unsupported Set Type');
      }
    } else {
      if (doNotCreate === true) {
        throw new Error(
          'CRDT not found in Stateful Object and doNotCreate is set to true',
        );
      }
      if (crdtType === miso.common.CRDTSetType.ORSET) {
        crdt = new OptORSet(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.GSET) {
        crdt = new GSet(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.MVREGISTER) {
        crdt = new MVRegister(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.EWFLAG) {
        crdt = new EnableWinsFlag(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.GCOUNTER) {
        crdt = new GCounter(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.PNCOUNTER) {
        crdt = new PNCounter(statefulObject.id, crdtName);
      } else if (crdtType === miso.common.CRDTSetType.ORMAP) {
        crdt = new ORMap<K, V>(statefulObject.id, crdtName);
      } else {
        throw new Error('Unsupported Set Type');
      }
      statefulObject.addCrdt(crdtName, crdt);
    }
    return crdt;
  }
}
