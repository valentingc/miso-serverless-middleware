/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import {
  BoolResponse,
  CausalCrdtVectorClock,
  CounterInitRequest,
  CounterResponse,
  CRDTSetType,
  cRDTSetTypeFromJSON,
  cRDTSetTypeToJSON,
  FlagSetValueReponse,
  ReplicaVersion,
  ServerlessFunctionBaseInformation,
  SetGenericType,
  setGenericTypeFromJSON,
  setGenericTypeToJSON,
  SetInitRequest,
  SetOrRegisterValueResponse,
  SetOrRegisterValueResponseNumberValues,
  SetOrRegisterValueResponseObjectValues,
  SetOrRegisterValueResponseStringValues,
  StatefulObjectBaseInformation,
} from "./common";
import { Timestamp } from "./google/protobuf/timestamp";

export interface GCounterUpdate {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  sentAtUtc: Timestamp | undefined;
  srcMap: { [key: string]: number };
  srcCurrentValue: number;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface GCounterUpdate_SrcMapEntry {
  key: string;
  value: number;
}

export interface RetrieveGCounterResponse {
  value?: GCounterUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface PNCounterUpdate {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  sentAtUtc: Timestamp | undefined;
  srcMapPositive: { [key: string]: number };
  srcMapNegative: { [key: string]: number };
  srcCurrentValue: number;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface PNCounterUpdate_SrcMapPositiveEntry {
  key: string;
  value: number;
}

export interface PNCounterUpdate_SrcMapNegativeEntry {
  key: string;
  value: number;
}

export interface RetrievePNCounterResponse {
  value?: PNCounterUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface EWFlagUpdate {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  sentAtUtc: Timestamp | undefined;
  srcCurrentValue: boolean;
  vectorClock: CausalCrdtVectorClock | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface RetrieveEWFlagResponse {
  value?: EWFlagUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface MVRegisterUpdate {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  sentAtUtc: Timestamp | undefined;
  srcCurrentValue: boolean;
  vectorClock: CausalCrdtVectorClock | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
  type: SetGenericType;
  valuesString?: SetOrRegisterValueResponseStringValues | undefined;
  valuesNumber?: SetOrRegisterValueResponseNumberValues | undefined;
  valuesObject?: SetOrRegisterValueResponseObjectValues | undefined;
}

export interface RetrieveORSetResponse {
  value?: ORSetUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface RetrieveGSetResponse {
  value?: MVRegisterUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface RetrieveMVRegisterResponse {
  value?: MVRegisterUpdate | undefined;
  hasValue: BoolResponse | undefined;
}

export interface ORSetUpdate {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  sentAtUtc: Timestamp | undefined;
  srcCurrentValue: boolean;
  vectorClock: CausalCrdtVectorClock | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
  type: SetGenericType;
  elements: { [key: string]: ReplicaVersion };
}

export interface ORSetUpdate_ElementsEntry {
  key: string;
  value: ReplicaVersion | undefined;
}

export interface ORMapUpdate {
  keysOrSet: ORSetUpdate | undefined;
  map: { [key: string]: ORMapUpdateEntry };
}

export interface ORMapUpdate_MapEntry {
  key: string;
  value: ORMapUpdateEntry | undefined;
}

export interface ORMapUpdateEntry {
  keyType: SetGenericType;
  valueCrdtType: CRDTSetType;
  valueCrdtName: string;
}

export const MISO_REPLICATION_PACKAGE_NAME = "miso.replication";

function createBaseGCounterUpdate(): GCounterUpdate {
  return {
    statefulObjectBase: undefined,
    sentAtUtc: undefined,
    srcMap: {},
    srcCurrentValue: 0,
    functionBase: undefined,
  };
}

export const GCounterUpdate = {
  encode(message: GCounterUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.sentAtUtc !== undefined) {
      Timestamp.encode(message.sentAtUtc, writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.srcMap).forEach(([key, value]) => {
      GCounterUpdate_SrcMapEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    if (message.srcCurrentValue !== 0) {
      writer.uint32(32).uint64(message.srcCurrentValue);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GCounterUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGCounterUpdate();
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

          message.sentAtUtc = Timestamp.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = GCounterUpdate_SrcMapEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.srcMap[entry3.key] = entry3.value;
          }
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.srcCurrentValue = longToNumber(reader.uint64() as Long);
          continue;
        case 5:
          if (tag !== 42) {
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

  fromJSON(object: any): GCounterUpdate {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      sentAtUtc: isSet(object.sentAtUtc) ? fromJsonTimestamp(object.sentAtUtc) : undefined,
      srcMap: isObject(object.srcMap)
        ? Object.entries(object.srcMap).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      srcCurrentValue: isSet(object.srcCurrentValue) ? Number(object.srcCurrentValue) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: GCounterUpdate): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.sentAtUtc !== undefined) {
      obj.sentAtUtc = fromTimestamp(message.sentAtUtc).toISOString();
    }
    if (message.srcMap) {
      const entries = Object.entries(message.srcMap);
      if (entries.length > 0) {
        obj.srcMap = {};
        entries.forEach(([k, v]) => {
          obj.srcMap[k] = Math.round(v);
        });
      }
    }
    if (message.srcCurrentValue !== 0) {
      obj.srcCurrentValue = Math.round(message.srcCurrentValue);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseGCounterUpdate_SrcMapEntry(): GCounterUpdate_SrcMapEntry {
  return { key: "", value: 0 };
}

export const GCounterUpdate_SrcMapEntry = {
  encode(message: GCounterUpdate_SrcMapEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GCounterUpdate_SrcMapEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGCounterUpdate_SrcMapEntry();
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

  fromJSON(object: any): GCounterUpdate_SrcMapEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: GCounterUpdate_SrcMapEntry): unknown {
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

function createBaseRetrieveGCounterResponse(): RetrieveGCounterResponse {
  return { hasValue: undefined };
}

export const RetrieveGCounterResponse = {
  encode(message: RetrieveGCounterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      GCounterUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrieveGCounterResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrieveGCounterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = GCounterUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrieveGCounterResponse {
    return {
      value: isSet(object.value) ? GCounterUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrieveGCounterResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = GCounterUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBasePNCounterUpdate(): PNCounterUpdate {
  return {
    statefulObjectBase: undefined,
    sentAtUtc: undefined,
    srcMapPositive: {},
    srcMapNegative: {},
    srcCurrentValue: 0,
    functionBase: undefined,
  };
}

export const PNCounterUpdate = {
  encode(message: PNCounterUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.sentAtUtc !== undefined) {
      Timestamp.encode(message.sentAtUtc, writer.uint32(18).fork()).ldelim();
    }
    Object.entries(message.srcMapPositive).forEach(([key, value]) => {
      PNCounterUpdate_SrcMapPositiveEntry.encode({ key: key as any, value }, writer.uint32(26).fork()).ldelim();
    });
    Object.entries(message.srcMapNegative).forEach(([key, value]) => {
      PNCounterUpdate_SrcMapNegativeEntry.encode({ key: key as any, value }, writer.uint32(34).fork()).ldelim();
    });
    if (message.srcCurrentValue !== 0) {
      writer.uint32(40).uint64(message.srcCurrentValue);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PNCounterUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePNCounterUpdate();
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

          message.sentAtUtc = Timestamp.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          const entry3 = PNCounterUpdate_SrcMapPositiveEntry.decode(reader, reader.uint32());
          if (entry3.value !== undefined) {
            message.srcMapPositive[entry3.key] = entry3.value;
          }
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          const entry4 = PNCounterUpdate_SrcMapNegativeEntry.decode(reader, reader.uint32());
          if (entry4.value !== undefined) {
            message.srcMapNegative[entry4.key] = entry4.value;
          }
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.srcCurrentValue = longToNumber(reader.uint64() as Long);
          continue;
        case 6:
          if (tag !== 50) {
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

  fromJSON(object: any): PNCounterUpdate {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      sentAtUtc: isSet(object.sentAtUtc) ? fromJsonTimestamp(object.sentAtUtc) : undefined,
      srcMapPositive: isObject(object.srcMapPositive)
        ? Object.entries(object.srcMapPositive).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      srcMapNegative: isObject(object.srcMapNegative)
        ? Object.entries(object.srcMapNegative).reduce<{ [key: string]: number }>((acc, [key, value]) => {
          acc[key] = Number(value);
          return acc;
        }, {})
        : {},
      srcCurrentValue: isSet(object.srcCurrentValue) ? Number(object.srcCurrentValue) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: PNCounterUpdate): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.sentAtUtc !== undefined) {
      obj.sentAtUtc = fromTimestamp(message.sentAtUtc).toISOString();
    }
    if (message.srcMapPositive) {
      const entries = Object.entries(message.srcMapPositive);
      if (entries.length > 0) {
        obj.srcMapPositive = {};
        entries.forEach(([k, v]) => {
          obj.srcMapPositive[k] = Math.round(v);
        });
      }
    }
    if (message.srcMapNegative) {
      const entries = Object.entries(message.srcMapNegative);
      if (entries.length > 0) {
        obj.srcMapNegative = {};
        entries.forEach(([k, v]) => {
          obj.srcMapNegative[k] = Math.round(v);
        });
      }
    }
    if (message.srcCurrentValue !== 0) {
      obj.srcCurrentValue = Math.round(message.srcCurrentValue);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBasePNCounterUpdate_SrcMapPositiveEntry(): PNCounterUpdate_SrcMapPositiveEntry {
  return { key: "", value: 0 };
}

export const PNCounterUpdate_SrcMapPositiveEntry = {
  encode(message: PNCounterUpdate_SrcMapPositiveEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PNCounterUpdate_SrcMapPositiveEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePNCounterUpdate_SrcMapPositiveEntry();
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

  fromJSON(object: any): PNCounterUpdate_SrcMapPositiveEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: PNCounterUpdate_SrcMapPositiveEntry): unknown {
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

function createBasePNCounterUpdate_SrcMapNegativeEntry(): PNCounterUpdate_SrcMapNegativeEntry {
  return { key: "", value: 0 };
}

export const PNCounterUpdate_SrcMapNegativeEntry = {
  encode(message: PNCounterUpdate_SrcMapNegativeEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== 0) {
      writer.uint32(16).uint64(message.value);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PNCounterUpdate_SrcMapNegativeEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePNCounterUpdate_SrcMapNegativeEntry();
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

  fromJSON(object: any): PNCounterUpdate_SrcMapNegativeEntry {
    return { key: isSet(object.key) ? String(object.key) : "", value: isSet(object.value) ? Number(object.value) : 0 };
  },

  toJSON(message: PNCounterUpdate_SrcMapNegativeEntry): unknown {
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

function createBaseRetrievePNCounterResponse(): RetrievePNCounterResponse {
  return { hasValue: undefined };
}

export const RetrievePNCounterResponse = {
  encode(message: RetrievePNCounterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      PNCounterUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrievePNCounterResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrievePNCounterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = PNCounterUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrievePNCounterResponse {
    return {
      value: isSet(object.value) ? PNCounterUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrievePNCounterResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = PNCounterUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBaseEWFlagUpdate(): EWFlagUpdate {
  return {
    statefulObjectBase: undefined,
    sentAtUtc: undefined,
    srcCurrentValue: false,
    vectorClock: undefined,
    functionBase: undefined,
  };
}

export const EWFlagUpdate = {
  encode(message: EWFlagUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.sentAtUtc !== undefined) {
      Timestamp.encode(message.sentAtUtc, writer.uint32(18).fork()).ldelim();
    }
    if (message.srcCurrentValue === true) {
      writer.uint32(24).bool(message.srcCurrentValue);
    }
    if (message.vectorClock !== undefined) {
      CausalCrdtVectorClock.encode(message.vectorClock, writer.uint32(34).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EWFlagUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEWFlagUpdate();
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

          message.sentAtUtc = Timestamp.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.srcCurrentValue = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.vectorClock = CausalCrdtVectorClock.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
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

  fromJSON(object: any): EWFlagUpdate {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      sentAtUtc: isSet(object.sentAtUtc) ? fromJsonTimestamp(object.sentAtUtc) : undefined,
      srcCurrentValue: isSet(object.srcCurrentValue) ? Boolean(object.srcCurrentValue) : false,
      vectorClock: isSet(object.vectorClock) ? CausalCrdtVectorClock.fromJSON(object.vectorClock) : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: EWFlagUpdate): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.sentAtUtc !== undefined) {
      obj.sentAtUtc = fromTimestamp(message.sentAtUtc).toISOString();
    }
    if (message.srcCurrentValue === true) {
      obj.srcCurrentValue = message.srcCurrentValue;
    }
    if (message.vectorClock !== undefined) {
      obj.vectorClock = CausalCrdtVectorClock.toJSON(message.vectorClock);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseRetrieveEWFlagResponse(): RetrieveEWFlagResponse {
  return { hasValue: undefined };
}

export const RetrieveEWFlagResponse = {
  encode(message: RetrieveEWFlagResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      EWFlagUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrieveEWFlagResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrieveEWFlagResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = EWFlagUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrieveEWFlagResponse {
    return {
      value: isSet(object.value) ? EWFlagUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrieveEWFlagResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = EWFlagUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBaseMVRegisterUpdate(): MVRegisterUpdate {
  return {
    statefulObjectBase: undefined,
    sentAtUtc: undefined,
    srcCurrentValue: false,
    vectorClock: undefined,
    functionBase: undefined,
    type: 0,
  };
}

export const MVRegisterUpdate = {
  encode(message: MVRegisterUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.sentAtUtc !== undefined) {
      Timestamp.encode(message.sentAtUtc, writer.uint32(18).fork()).ldelim();
    }
    if (message.srcCurrentValue === true) {
      writer.uint32(24).bool(message.srcCurrentValue);
    }
    if (message.vectorClock !== undefined) {
      CausalCrdtVectorClock.encode(message.vectorClock, writer.uint32(34).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(42).fork()).ldelim();
    }
    if (message.type !== 0) {
      writer.uint32(48).int32(message.type);
    }
    if (message.valuesString !== undefined) {
      SetOrRegisterValueResponseStringValues.encode(message.valuesString, writer.uint32(58).fork()).ldelim();
    }
    if (message.valuesNumber !== undefined) {
      SetOrRegisterValueResponseNumberValues.encode(message.valuesNumber, writer.uint32(66).fork()).ldelim();
    }
    if (message.valuesObject !== undefined) {
      SetOrRegisterValueResponseObjectValues.encode(message.valuesObject, writer.uint32(74).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MVRegisterUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMVRegisterUpdate();
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

          message.sentAtUtc = Timestamp.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.srcCurrentValue = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.vectorClock = CausalCrdtVectorClock.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.valuesString = SetOrRegisterValueResponseStringValues.decode(reader, reader.uint32());
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.valuesNumber = SetOrRegisterValueResponseNumberValues.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
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

  fromJSON(object: any): MVRegisterUpdate {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      sentAtUtc: isSet(object.sentAtUtc) ? fromJsonTimestamp(object.sentAtUtc) : undefined,
      srcCurrentValue: isSet(object.srcCurrentValue) ? Boolean(object.srcCurrentValue) : false,
      vectorClock: isSet(object.vectorClock) ? CausalCrdtVectorClock.fromJSON(object.vectorClock) : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
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

  toJSON(message: MVRegisterUpdate): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.sentAtUtc !== undefined) {
      obj.sentAtUtc = fromTimestamp(message.sentAtUtc).toISOString();
    }
    if (message.srcCurrentValue === true) {
      obj.srcCurrentValue = message.srcCurrentValue;
    }
    if (message.vectorClock !== undefined) {
      obj.vectorClock = CausalCrdtVectorClock.toJSON(message.vectorClock);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
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

function createBaseRetrieveORSetResponse(): RetrieveORSetResponse {
  return { hasValue: undefined };
}

export const RetrieveORSetResponse = {
  encode(message: RetrieveORSetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      ORSetUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrieveORSetResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrieveORSetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = ORSetUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrieveORSetResponse {
    return {
      value: isSet(object.value) ? ORSetUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrieveORSetResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = ORSetUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBaseRetrieveGSetResponse(): RetrieveGSetResponse {
  return { hasValue: undefined };
}

export const RetrieveGSetResponse = {
  encode(message: RetrieveGSetResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      MVRegisterUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrieveGSetResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrieveGSetResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = MVRegisterUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrieveGSetResponse {
    return {
      value: isSet(object.value) ? MVRegisterUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrieveGSetResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = MVRegisterUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBaseRetrieveMVRegisterResponse(): RetrieveMVRegisterResponse {
  return { hasValue: undefined };
}

export const RetrieveMVRegisterResponse = {
  encode(message: RetrieveMVRegisterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.value !== undefined) {
      MVRegisterUpdate.encode(message.value, writer.uint32(10).fork()).ldelim();
    }
    if (message.hasValue !== undefined) {
      BoolResponse.encode(message.hasValue, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RetrieveMVRegisterResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRetrieveMVRegisterResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.value = MVRegisterUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.hasValue = BoolResponse.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): RetrieveMVRegisterResponse {
    return {
      value: isSet(object.value) ? MVRegisterUpdate.fromJSON(object.value) : undefined,
      hasValue: isSet(object.hasValue) ? BoolResponse.fromJSON(object.hasValue) : undefined,
    };
  },

  toJSON(message: RetrieveMVRegisterResponse): unknown {
    const obj: any = {};
    if (message.value !== undefined) {
      obj.value = MVRegisterUpdate.toJSON(message.value);
    }
    if (message.hasValue !== undefined) {
      obj.hasValue = BoolResponse.toJSON(message.hasValue);
    }
    return obj;
  },
};

function createBaseORSetUpdate(): ORSetUpdate {
  return {
    statefulObjectBase: undefined,
    sentAtUtc: undefined,
    srcCurrentValue: false,
    vectorClock: undefined,
    functionBase: undefined,
    type: 0,
    elements: {},
  };
}

export const ORSetUpdate = {
  encode(message: ORSetUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.sentAtUtc !== undefined) {
      Timestamp.encode(message.sentAtUtc, writer.uint32(18).fork()).ldelim();
    }
    if (message.srcCurrentValue === true) {
      writer.uint32(24).bool(message.srcCurrentValue);
    }
    if (message.vectorClock !== undefined) {
      CausalCrdtVectorClock.encode(message.vectorClock, writer.uint32(34).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(42).fork()).ldelim();
    }
    if (message.type !== 0) {
      writer.uint32(48).int32(message.type);
    }
    Object.entries(message.elements).forEach(([key, value]) => {
      ORSetUpdate_ElementsEntry.encode({ key: key as any, value }, writer.uint32(58).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ORSetUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseORSetUpdate();
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

          message.sentAtUtc = Timestamp.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.srcCurrentValue = reader.bool();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.vectorClock = CausalCrdtVectorClock.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          const entry7 = ORSetUpdate_ElementsEntry.decode(reader, reader.uint32());
          if (entry7.value !== undefined) {
            message.elements[entry7.key] = entry7.value;
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

  fromJSON(object: any): ORSetUpdate {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      sentAtUtc: isSet(object.sentAtUtc) ? fromJsonTimestamp(object.sentAtUtc) : undefined,
      srcCurrentValue: isSet(object.srcCurrentValue) ? Boolean(object.srcCurrentValue) : false,
      vectorClock: isSet(object.vectorClock) ? CausalCrdtVectorClock.fromJSON(object.vectorClock) : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      type: isSet(object.type) ? setGenericTypeFromJSON(object.type) : 0,
      elements: isObject(object.elements)
        ? Object.entries(object.elements).reduce<{ [key: string]: ReplicaVersion }>((acc, [key, value]) => {
          acc[key] = ReplicaVersion.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ORSetUpdate): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.sentAtUtc !== undefined) {
      obj.sentAtUtc = fromTimestamp(message.sentAtUtc).toISOString();
    }
    if (message.srcCurrentValue === true) {
      obj.srcCurrentValue = message.srcCurrentValue;
    }
    if (message.vectorClock !== undefined) {
      obj.vectorClock = CausalCrdtVectorClock.toJSON(message.vectorClock);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.type !== 0) {
      obj.type = setGenericTypeToJSON(message.type);
    }
    if (message.elements) {
      const entries = Object.entries(message.elements);
      if (entries.length > 0) {
        obj.elements = {};
        entries.forEach(([k, v]) => {
          obj.elements[k] = ReplicaVersion.toJSON(v);
        });
      }
    }
    return obj;
  },
};

function createBaseORSetUpdate_ElementsEntry(): ORSetUpdate_ElementsEntry {
  return { key: "", value: undefined };
}

export const ORSetUpdate_ElementsEntry = {
  encode(message: ORSetUpdate_ElementsEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ReplicaVersion.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ORSetUpdate_ElementsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseORSetUpdate_ElementsEntry();
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
          if (tag !== 18) {
            break;
          }

          message.value = ReplicaVersion.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ORSetUpdate_ElementsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ReplicaVersion.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ORSetUpdate_ElementsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = ReplicaVersion.toJSON(message.value);
    }
    return obj;
  },
};

function createBaseORMapUpdate(): ORMapUpdate {
  return { keysOrSet: undefined, map: {} };
}

export const ORMapUpdate = {
  encode(message: ORMapUpdate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keysOrSet !== undefined) {
      ORSetUpdate.encode(message.keysOrSet, writer.uint32(10).fork()).ldelim();
    }
    Object.entries(message.map).forEach(([key, value]) => {
      ORMapUpdate_MapEntry.encode({ key: key as any, value }, writer.uint32(18).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ORMapUpdate {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseORMapUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.keysOrSet = ORSetUpdate.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          const entry2 = ORMapUpdate_MapEntry.decode(reader, reader.uint32());
          if (entry2.value !== undefined) {
            message.map[entry2.key] = entry2.value;
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

  fromJSON(object: any): ORMapUpdate {
    return {
      keysOrSet: isSet(object.keysOrSet) ? ORSetUpdate.fromJSON(object.keysOrSet) : undefined,
      map: isObject(object.map)
        ? Object.entries(object.map).reduce<{ [key: string]: ORMapUpdateEntry }>((acc, [key, value]) => {
          acc[key] = ORMapUpdateEntry.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: ORMapUpdate): unknown {
    const obj: any = {};
    if (message.keysOrSet !== undefined) {
      obj.keysOrSet = ORSetUpdate.toJSON(message.keysOrSet);
    }
    if (message.map) {
      const entries = Object.entries(message.map);
      if (entries.length > 0) {
        obj.map = {};
        entries.forEach(([k, v]) => {
          obj.map[k] = ORMapUpdateEntry.toJSON(v);
        });
      }
    }
    return obj;
  },
};

function createBaseORMapUpdate_MapEntry(): ORMapUpdate_MapEntry {
  return { key: "", value: undefined };
}

export const ORMapUpdate_MapEntry = {
  encode(message: ORMapUpdate_MapEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ORMapUpdateEntry.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ORMapUpdate_MapEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseORMapUpdate_MapEntry();
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
          if (tag !== 18) {
            break;
          }

          message.value = ORMapUpdateEntry.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ORMapUpdate_MapEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ORMapUpdateEntry.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ORMapUpdate_MapEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = ORMapUpdateEntry.toJSON(message.value);
    }
    return obj;
  },
};

function createBaseORMapUpdateEntry(): ORMapUpdateEntry {
  return { keyType: 0, valueCrdtType: 0, valueCrdtName: "" };
}

export const ORMapUpdateEntry = {
  encode(message: ORMapUpdateEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.keyType !== 0) {
      writer.uint32(8).int32(message.keyType);
    }
    if (message.valueCrdtType !== 0) {
      writer.uint32(16).int32(message.valueCrdtType);
    }
    if (message.valueCrdtName !== "") {
      writer.uint32(26).string(message.valueCrdtName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ORMapUpdateEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseORMapUpdateEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.keyType = reader.int32() as any;
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.valueCrdtType = reader.int32() as any;
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.valueCrdtName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ORMapUpdateEntry {
    return {
      keyType: isSet(object.keyType) ? setGenericTypeFromJSON(object.keyType) : 0,
      valueCrdtType: isSet(object.valueCrdtType) ? cRDTSetTypeFromJSON(object.valueCrdtType) : 0,
      valueCrdtName: isSet(object.valueCrdtName) ? String(object.valueCrdtName) : "",
    };
  },

  toJSON(message: ORMapUpdateEntry): unknown {
    const obj: any = {};
    if (message.keyType !== 0) {
      obj.keyType = setGenericTypeToJSON(message.keyType);
    }
    if (message.valueCrdtType !== 0) {
      obj.valueCrdtType = cRDTSetTypeToJSON(message.valueCrdtType);
    }
    if (message.valueCrdtName !== "") {
      obj.valueCrdtName = message.valueCrdtName;
    }
    return obj;
  },
};

export interface ReplicationServiceClient {
  retrieveGCounter(request: CounterInitRequest, metadata: Metadata, ...rest: any): Observable<RetrieveGCounterResponse>;

  mergeGCounter(request: Observable<GCounterUpdate>, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  retrievePnCounter(
    request: CounterInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<RetrievePNCounterResponse>;

  mergePnCounter(request: Observable<PNCounterUpdate>, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  retrieveEwFlag(request: CounterInitRequest, metadata: Metadata, ...rest: any): Observable<RetrieveEWFlagResponse>;

  mergeEwFlag(request: Observable<EWFlagUpdate>, metadata: Metadata, ...rest: any): Observable<FlagSetValueReponse>;

  retrieveMvRegister(request: SetInitRequest, metadata: Metadata, ...rest: any): Observable<RetrieveMVRegisterResponse>;

  mergeMvRegister(
    request: Observable<MVRegisterUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  retrieveGSet(request: SetInitRequest, metadata: Metadata, ...rest: any): Observable<RetrieveGSetResponse>;

  mergeGSet(
    request: Observable<MVRegisterUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  retrieveOrSet(request: SetInitRequest, metadata: Metadata, ...rest: any): Observable<RetrieveORSetResponse>;

  mergeOrSet(
    request: Observable<ORSetUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;
}

export interface ReplicationServiceController {
  retrieveGCounter(
    request: CounterInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrieveGCounterResponse> | Observable<RetrieveGCounterResponse> | RetrieveGCounterResponse;

  mergeGCounter(request: Observable<GCounterUpdate>, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  retrievePnCounter(
    request: CounterInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrievePNCounterResponse> | Observable<RetrievePNCounterResponse> | RetrievePNCounterResponse;

  mergePnCounter(request: Observable<PNCounterUpdate>, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  retrieveEwFlag(
    request: CounterInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrieveEWFlagResponse> | Observable<RetrieveEWFlagResponse> | RetrieveEWFlagResponse;

  mergeEwFlag(request: Observable<EWFlagUpdate>, metadata: Metadata, ...rest: any): Observable<FlagSetValueReponse>;

  retrieveMvRegister(
    request: SetInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrieveMVRegisterResponse> | Observable<RetrieveMVRegisterResponse> | RetrieveMVRegisterResponse;

  mergeMvRegister(
    request: Observable<MVRegisterUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  retrieveGSet(
    request: SetInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrieveGSetResponse> | Observable<RetrieveGSetResponse> | RetrieveGSetResponse;

  mergeGSet(
    request: Observable<MVRegisterUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  retrieveOrSet(
    request: SetInitRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<RetrieveORSetResponse> | Observable<RetrieveORSetResponse> | RetrieveORSetResponse;

  mergeOrSet(
    request: Observable<ORSetUpdate>,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;
}

export function ReplicationServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "retrieveGCounter",
      "retrievePnCounter",
      "retrieveEwFlag",
      "retrieveMvRegister",
      "retrieveGSet",
      "retrieveOrSet",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ReplicationService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [
      "mergeGCounter",
      "mergePnCounter",
      "mergeEwFlag",
      "mergeMvRegister",
      "mergeGSet",
      "mergeOrSet",
    ];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ReplicationService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const REPLICATION_SERVICE_NAME = "ReplicationService";

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

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Timestamp {
  if (o instanceof Date) {
    return toTimestamp(o);
  } else if (typeof o === "string") {
    return toTimestamp(new Date(o));
  } else {
    return Timestamp.fromJSON(o);
  }
}

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
