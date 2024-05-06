/* eslint-disable */
import Long from "long";
import { wrappers } from "protobufjs";
import _m0 from "protobufjs/minimal";
import { Struct } from "./google/protobuf/struct";

export enum SetGenericType {
  STRING = 0,
  NUMBER = 1,
  OBJECT = 2,
  UNRECOGNIZED = -1,
}

export function setGenericTypeFromJSON(object: any): SetGenericType {
  switch (object) {
    case 0:
    case "STRING":
      return SetGenericType.STRING;
    case 1:
    case "NUMBER":
      return SetGenericType.NUMBER;
    case 2:
    case "OBJECT":
      return SetGenericType.OBJECT;
    case -1:
    case "UNRECOGNIZED":
    default:
      return SetGenericType.UNRECOGNIZED;
  }
}

export function setGenericTypeToJSON(object: SetGenericType): string {
  switch (object) {
    case SetGenericType.STRING:
      return "STRING";
    case SetGenericType.NUMBER:
      return "NUMBER";
    case SetGenericType.OBJECT:
      return "OBJECT";
    case SetGenericType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export enum CRDTSetType {
  MVREGISTER = 0,
  ORSET = 1,
  GSET = 2,
  GCOUNTER = 3,
  PNCOUNTER = 4,
  EWFLAG = 5,
  ORMAP = 6,
  UNRECOGNIZED = -1,
}

export function cRDTSetTypeFromJSON(object: any): CRDTSetType {
  switch (object) {
    case 0:
    case "MVREGISTER":
      return CRDTSetType.MVREGISTER;
    case 1:
    case "ORSET":
      return CRDTSetType.ORSET;
    case 2:
    case "GSET":
      return CRDTSetType.GSET;
    case 3:
    case "GCOUNTER":
      return CRDTSetType.GCOUNTER;
    case 4:
    case "PNCOUNTER":
      return CRDTSetType.PNCOUNTER;
    case 5:
    case "EWFLAG":
      return CRDTSetType.EWFLAG;
    case 6:
    case "ORMAP":
      return CRDTSetType.ORMAP;
    case -1:
    case "UNRECOGNIZED":
    default:
      return CRDTSetType.UNRECOGNIZED;
  }
}

export function cRDTSetTypeToJSON(object: CRDTSetType): string {
  switch (object) {
    case CRDTSetType.MVREGISTER:
      return "MVREGISTER";
    case CRDTSetType.ORSET:
      return "ORSET";
    case CRDTSetType.GSET:
      return "GSET";
    case CRDTSetType.GCOUNTER:
      return "GCOUNTER";
    case CRDTSetType.PNCOUNTER:
      return "PNCOUNTER";
    case CRDTSetType.EWFLAG:
      return "EWFLAG";
    case CRDTSetType.ORMAP:
      return "ORMAP";
    case CRDTSetType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ReplicaVersion {
  replicaId: string;
  version: number;
}

export interface CausalCrdtVectorClock {
  srcVectorClock: { [key: string]: number };
}

export interface CausalCrdtVectorClock_SrcVectorClockEntry {
  key: string;
  value: number;
}

export interface StatefulObjectBaseInformation {
  statefulObjectId: string;
  crdtName: string;
}

export interface ServerlessFunctionBaseInformation {
  serverlessFunctionName: string;
}

export interface CounterResponse {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  value: number;
}

export interface SetOrRegisterValueResponseStringValues {
  values: string[];
}

export interface SetOrRegisterValueResponseNumberValues {
  values: number[];
}

export interface SetOrRegisterValueResponseObjectValues {
  values: { [key: string]: any }[];
}

export interface SetOrRegisterValueResponse {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  type: SetGenericType;
  valuesString?: SetOrRegisterValueResponseStringValues | undefined;
  valuesNumber?: SetOrRegisterValueResponseNumberValues | undefined;
  valuesObject?: SetOrRegisterValueResponseObjectValues | undefined;
}

export interface FlagSetValueReponse {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  value: boolean;
}

export interface CounterInitRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface SetInitRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
  setGenerictype: SetGenericType;
  crdtSetType: CRDTSetType;
}

export interface BoolResponse {
  response: boolean;
}

export interface AckResponse {
  acknowledged: boolean;
}

export interface Void {
}

export const MISO_COMMON_PACKAGE_NAME = "miso.common";

function createBaseReplicaVersion(): ReplicaVersion {
  return { replicaId: "", version: 0 };
}

export const ReplicaVersion = {
  encode(message: ReplicaVersion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.replicaId !== "") {
      writer.uint32(10).string(message.replicaId);
    }
    if (message.version !== 0) {
      writer.uint32(16).uint64(message.version);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplicaVersion {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplicaVersion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.replicaId = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.version = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplicaVersion {
    return {
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
      version: isSet(object.version) ? Number(object.version) : 0,
    };
  },

  toJSON(message: ReplicaVersion): unknown {
    const obj: any = {};
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    if (message.version !== 0) {
      obj.version = Math.round(message.version);
    }
    return obj;
  },
};

function createBaseCausalCrdtVectorClock(): CausalCrdtVectorClock {
  return { srcVectorClock: {} };
}

export const CausalCrdtVectorClock = {
  encode(message: CausalCrdtVectorClock, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.srcVectorClock).forEach(([key, value]) => {
      CausalCrdtVectorClock_SrcVectorClockEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CausalCrdtVectorClock {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCausalCrdtVectorClock();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = CausalCrdtVectorClock_SrcVectorClockEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.srcVectorClock[entry1.key] = entry1.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CausalCrdtVectorClock {
    return {
      srcVectorClock: isObject(object.srcVectorClock)
        ? Object.entries(object.srcVectorClock).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: CausalCrdtVectorClock): unknown {
    const obj: any = {};
    if (message.srcVectorClock) {
      const entries = Object.entries(message.srcVectorClock);
      if (entries.length > 0) {
        obj.srcVectorClock = {};
        entries.forEach(([k, v]) => {
          obj.srcVectorClock[k] = Math.round(v);
        });
      }
    }
    return obj;
  },
};

function createBaseCausalCrdtVectorClock_SrcVectorClockEntry(): CausalCrdtVectorClock_SrcVectorClockEntry {
  return { key: "", value: 0 };
}

export const CausalCrdtVectorClock_SrcVectorClockEntry = {
  encode(message: CausalCrdtVectorClock_SrcVectorClockEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CausalCrdtVectorClock_SrcVectorClockEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCausalCrdtVectorClock_SrcVectorClockEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = longToNumber(reader.uint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CausalCrdtVectorClock_SrcVectorClockEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: CausalCrdtVectorClock_SrcVectorClockEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
};

function createBaseStatefulObjectBaseInformation(): StatefulObjectBaseInformation {
  return { statefulObjectId: "", crdtName: "" };
}

export const StatefulObjectBaseInformation = {
  encode(message: StatefulObjectBaseInformation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectId !== "") {
      writer.uint32(10).string(message.statefulObjectId);
    }
    if (message.crdtName !== "") {
      writer.uint32(18).string(message.crdtName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatefulObjectBaseInformation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatefulObjectBaseInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.crdtName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): StatefulObjectBaseInformation {
    return {
      statefulObjectId: isSet(object.statefulObjectId) ? String(object.statefulObjectId) : "",
      crdtName: isSet(object.crdtName) ? String(object.crdtName) : "",
    };
  },

  toJSON(message: StatefulObjectBaseInformation): unknown {
    const obj: any = {};
    if (message.statefulObjectId !== "") {
      obj.statefulObjectId = message.statefulObjectId;
    }
    if (message.crdtName !== "") {
      obj.crdtName = message.crdtName;
    }
    return obj;
  },
};

function createBaseServerlessFunctionBaseInformation(): ServerlessFunctionBaseInformation {
  return { serverlessFunctionName: "" };
}

export const ServerlessFunctionBaseInformation = {
  encode(message: ServerlessFunctionBaseInformation, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serverlessFunctionName !== "") {
      writer.uint32(10).string(message.serverlessFunctionName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionBaseInformation {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionBaseInformation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.serverlessFunctionName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionBaseInformation {
    return {
      serverlessFunctionName: isSet(object.serverlessFunctionName) ? String(object.serverlessFunctionName) : "",
    };
  },

  toJSON(message: ServerlessFunctionBaseInformation): unknown {
    const obj: any = {};
    if (message.serverlessFunctionName !== "") {
      obj.serverlessFunctionName = message.serverlessFunctionName;
    }
    return obj;
  },
};

function createBaseCounterResponse(): CounterResponse {
  return { statefulObjectBase: undefined, value: 0 };
}

export const CounterResponse = {
  encode(message: CounterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.value !== 0) {
      writer.uint32(16).sint64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectBase = StatefulObjectBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = longToNumber(reader.sint64() as Long);
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CounterResponse {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      value: isSet(object.value) ? Number(object.value) : 0,
    };
  },

  toJSON(message: CounterResponse): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    return obj;
  },
};

function createBaseSetOrRegisterValueResponseStringValues(): SetOrRegisterValueResponseStringValues {
  return { values: [] };
}

export const SetOrRegisterValueResponseStringValues = {
  encode(message: SetOrRegisterValueResponseStringValues, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.values) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterValueResponseStringValues {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterValueResponseStringValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.values.push(reader.string());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetOrRegisterValueResponseStringValues {
    return { values: Array.isArray(object?.values) ? object.values.map((e: any) => String(e)) : [] };
  },

  toJSON(message: SetOrRegisterValueResponseStringValues): unknown {
    const obj: any = {};
    if (message.values?.length) {
      obj.values = message.values;
    }
    return obj;
  },
};

function createBaseSetOrRegisterValueResponseNumberValues(): SetOrRegisterValueResponseNumberValues {
  return { values: [] };
}

export const SetOrRegisterValueResponseNumberValues = {
  encode(message: SetOrRegisterValueResponseNumberValues, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    writer.uint32(10).fork();
    for (const v of message.values) {
      writer.double(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterValueResponseNumberValues {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterValueResponseNumberValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag === 9) {
            message.values.push(reader.double());

            continue;
          }

          if (tag === 10) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.values.push(reader.double());
            }

            continue;
          }

          break;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetOrRegisterValueResponseNumberValues {
    return { values: Array.isArray(object?.values) ? object.values.map((e: any) => Number(e)) : [] };
  },

  toJSON(message: SetOrRegisterValueResponseNumberValues): unknown {
    const obj: any = {};
    if (message.values?.length) {
      obj.values = message.values;
    }
    return obj;
  },
};

function createBaseSetOrRegisterValueResponseObjectValues(): SetOrRegisterValueResponseObjectValues {
  return { values: [] };
}

export const SetOrRegisterValueResponseObjectValues = {
  encode(message: SetOrRegisterValueResponseObjectValues, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.values) {
      Struct.encode(Struct.wrap(v!), writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterValueResponseObjectValues {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterValueResponseObjectValues();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.values.push(Struct.unwrap(Struct.decode(reader, reader.uint32())));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetOrRegisterValueResponseObjectValues {
    return { values: Array.isArray(object?.values) ? [...object.values] : [] };
  },

  toJSON(message: SetOrRegisterValueResponseObjectValues): unknown {
    const obj: any = {};
    if (message.values?.length) {
      obj.values = message.values;
    }
    return obj;
  },
};

function createBaseSetOrRegisterValueResponse(): SetOrRegisterValueResponse {
  return { statefulObjectBase: undefined, type: 0 };
}

export const SetOrRegisterValueResponse = {
  encode(message: SetOrRegisterValueResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.type !== 0) {
      writer.uint32(40).int32(message.type);
    }
    if (message.valuesString !== undefined) {
      SetOrRegisterValueResponseStringValues.encode(message.valuesString, writer.uint32(18).fork()).ldelim();
    }
    if (message.valuesNumber !== undefined) {
      SetOrRegisterValueResponseNumberValues.encode(message.valuesNumber, writer.uint32(26).fork()).ldelim();
    }
    if (message.valuesObject !== undefined) {
      SetOrRegisterValueResponseObjectValues.encode(message.valuesObject, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterValueResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterValueResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectBase = StatefulObjectBaseInformation.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.valuesString = SetOrRegisterValueResponseStringValues.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.valuesNumber = SetOrRegisterValueResponseNumberValues.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.valuesObject = SetOrRegisterValueResponseObjectValues.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetOrRegisterValueResponse {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      type: isSet(object.type) ? setGenericTypeFromJSON(object.type) : 0,
      valuesString: isSet(object.valuesString)
        ? SetOrRegisterValueResponseStringValues.fromJSON(object.valuesString)
        : undefined,
      valuesNumber: isSet(object.valuesNumber)
        ? SetOrRegisterValueResponseNumberValues.fromJSON(object.valuesNumber)
        : undefined,
      valuesObject: isSet(object.valuesObject)
        ? SetOrRegisterValueResponseObjectValues.fromJSON(object.valuesObject)
        : undefined,
    };
  },

  toJSON(message: SetOrRegisterValueResponse): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.type !== 0) {
      obj.type = setGenericTypeToJSON(message.type);
    }
    if (message.valuesString !== undefined) {
      obj.valuesString = SetOrRegisterValueResponseStringValues.toJSON(message.valuesString);
    }
    if (message.valuesNumber !== undefined) {
      obj.valuesNumber = SetOrRegisterValueResponseNumberValues.toJSON(message.valuesNumber);
    }
    if (message.valuesObject !== undefined) {
      obj.valuesObject = SetOrRegisterValueResponseObjectValues.toJSON(message.valuesObject);
    }
    return obj;
  },
};

function createBaseFlagSetValueReponse(): FlagSetValueReponse {
  return { statefulObjectBase: undefined, value: false };
}

export const FlagSetValueReponse = {
  encode(message: FlagSetValueReponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.value === true) {
      writer.uint32(16).bool(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FlagSetValueReponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFlagSetValueReponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectBase = StatefulObjectBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.value = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FlagSetValueReponse {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      value: isSet(object.value) ? Boolean(object.value) : false,
    };
  },

  toJSON(message: FlagSetValueReponse): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.value === true) {
      obj.value = message.value;
    }
    return obj;
  },
};

function createBaseCounterInitRequest(): CounterInitRequest {
  return { statefulObjectBase: undefined, functionBase: undefined };
}

export const CounterInitRequest = {
  encode(message: CounterInitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterInitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterInitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectBase = StatefulObjectBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CounterInitRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: CounterInitRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseSetInitRequest(): SetInitRequest {
  return { statefulObjectBase: undefined, functionBase: undefined, setGenerictype: 0, crdtSetType: 0 };
}

export const SetInitRequest = {
  encode(message: SetInitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    if (message.setGenerictype !== 0) {
      writer.uint32(24).int32(message.setGenerictype);
    }
    if (message.crdtSetType !== 0) {
      writer.uint32(32).int32(message.crdtSetType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetInitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetInitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.statefulObjectBase = StatefulObjectBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.setGenerictype = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.crdtSetType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SetInitRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      setGenerictype: isSet(object.setGenerictype) ? setGenericTypeFromJSON(object.setGenerictype) : 0,
      crdtSetType: isSet(object.crdtSetType) ? cRDTSetTypeFromJSON(object.crdtSetType) : 0,
    };
  },

  toJSON(message: SetInitRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.setGenerictype !== 0) {
      obj.setGenerictype = setGenericTypeToJSON(message.setGenerictype);
    }
    if (message.crdtSetType !== 0) {
      obj.crdtSetType = cRDTSetTypeToJSON(message.crdtSetType);
    }
    return obj;
  },
};

function createBaseBoolResponse(): BoolResponse {
  return { response: false };
}

export const BoolResponse = {
  encode(message: BoolResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.response === true) {
      writer.uint32(8).bool(message.response);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BoolResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBoolResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.response = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): BoolResponse {
    return { response: isSet(object.response) ? Boolean(object.response) : false };
  },

  toJSON(message: BoolResponse): unknown {
    const obj: any = {};
    if (message.response === true) {
      obj.response = message.response;
    }
    return obj;
  },
};

function createBaseAckResponse(): AckResponse {
  return { acknowledged: false };
}

export const AckResponse = {
  encode(message: AckResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.acknowledged === true) {
      writer.uint32(8).bool(message.acknowledged);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AckResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAckResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.acknowledged = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AckResponse {
    return { acknowledged: isSet(object.acknowledged) ? Boolean(object.acknowledged) : false };
  },

  toJSON(message: AckResponse): unknown {
    const obj: any = {};
    if (message.acknowledged === true) {
      obj.acknowledged = message.acknowledged;
    }
    return obj;
  },
};

function createBaseVoid(): Void {
  return {};
}

export const Void = {
  encode(_: Void, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Void {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVoid();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): Void {
    return {};
  },

  toJSON(_: Void): unknown {
    const obj: any = {};
    return obj;
  },
};

wrappers[".google.protobuf.Struct"] = { fromObject: Struct.wrap, toObject: Struct.unwrap } as any;

declare const self: any | undefined;
declare const window: any | undefined;
declare const global: any | undefined;
const tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new tsProtoGlobalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
