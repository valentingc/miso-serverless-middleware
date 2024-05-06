/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import {
  AckResponse,
  BoolResponse,
  CounterResponse,
  CRDTSetType,
  cRDTSetTypeFromJSON,
  cRDTSetTypeToJSON,
  FlagSetValueReponse,
  ServerlessFunctionBaseInformation,
  SetGenericType,
  setGenericTypeFromJSON,
  setGenericTypeToJSON,
  SetOrRegisterValueResponse,
  SetOrRegisterValueResponseNumberValues,
  SetOrRegisterValueResponseObjectValues,
  SetOrRegisterValueResponseStringValues,
  StatefulObjectBaseInformation,
} from "./common";

export interface DeleteCrdtRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface FlagSetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  value: boolean;
  functionBase: ServerlessFunctionBaseInformation | undefined;
  replicaId: string;
}

export interface SetOrRegisterSetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  replicaId: string;
  value: string;
  setValueType: SetGenericType;
  crdtType: CRDTSetType;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface MapSetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  replicaId: string;
  keyString?: string | undefined;
  keyNumber?: number | undefined;
  valueCrdtType: CRDTSetType;
  valueCrdtName: string;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface MapGetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  keyString?: string | undefined;
  keyNumber?: number | undefined;
  valueCrdtType: CRDTSetType;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface MapGetKeysRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
  keyType: SetGenericType;
}

export interface MapGetKeysResponse {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  keysString?: SetOrRegisterValueResponseStringValues | undefined;
  keysNumber?: SetOrRegisterValueResponseNumberValues | undefined;
  keysObject?: SetOrRegisterValueResponseObjectValues | undefined;
}

export interface MapValueResponse {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  keyString?: string | undefined;
  keyNumber?: number | undefined;
  hasValue: boolean;
  valueCrdtName?: string | undefined;
  valueCrdtType?: CRDTSetType | undefined;
}

export interface MapDeleteValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  keyString?: string | undefined;
  keyNumber?: number | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface MapClearValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface SetOrRegisterGetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  replicaId: string;
  type: SetGenericType;
  crdtType: CRDTSetType;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface CounterAddOrSubtractValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  replicaId: string;
  value: number;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export interface CounterGetValueRequest {
  statefulObjectBase: StatefulObjectBaseInformation | undefined;
  functionBase: ServerlessFunctionBaseInformation | undefined;
}

export const MISO_MIDDLEWARE_PACKAGE_NAME = "miso.middleware";

function createBaseDeleteCrdtRequest(): DeleteCrdtRequest {
  return { statefulObjectBase: undefined, functionBase: undefined };
}

export const DeleteCrdtRequest = {
  encode(message: DeleteCrdtRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeleteCrdtRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteCrdtRequest();
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

  fromJSON(object: any): DeleteCrdtRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: DeleteCrdtRequest): unknown {
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

function createBaseFlagSetValueRequest(): FlagSetValueRequest {
  return { statefulObjectBase: undefined, value: false, functionBase: undefined, replicaId: "" };
}

export const FlagSetValueRequest = {
  encode(message: FlagSetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.value === true) {
      writer.uint32(16).bool(message.value);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(26).fork()).ldelim();
    }
    if (message.replicaId !== "") {
      writer.uint32(34).string(message.replicaId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FlagSetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFlagSetValueRequest();
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
        case 3:
          if (tag !== 26) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.replicaId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): FlagSetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      value: isSet(object.value) ? Boolean(object.value) : false,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
    };
  },

  toJSON(message: FlagSetValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.value === true) {
      obj.value = message.value;
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    return obj;
  },
};

function createBaseSetOrRegisterSetValueRequest(): SetOrRegisterSetValueRequest {
  return {
    statefulObjectBase: undefined,
    replicaId: "",
    value: "",
    setValueType: 0,
    crdtType: 0,
    functionBase: undefined,
  };
}

export const SetOrRegisterSetValueRequest = {
  encode(message: SetOrRegisterSetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.replicaId !== "") {
      writer.uint32(18).string(message.replicaId);
    }
    if (message.value !== "") {
      writer.uint32(26).string(message.value);
    }
    if (message.setValueType !== 0) {
      writer.uint32(32).int32(message.setValueType);
    }
    if (message.crdtType !== 0) {
      writer.uint32(40).int32(message.crdtType);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterSetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterSetValueRequest();
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

          message.replicaId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.value = reader.string();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.setValueType = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.crdtType = reader.int32() as any;
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

  fromJSON(object: any): SetOrRegisterSetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
      value: isSet(object.value) ? String(object.value) : "",
      setValueType: isSet(object.setValueType) ? setGenericTypeFromJSON(object.setValueType) : 0,
      crdtType: isSet(object.crdtType) ? cRDTSetTypeFromJSON(object.crdtType) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: SetOrRegisterSetValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    if (message.value !== "") {
      obj.value = message.value;
    }
    if (message.setValueType !== 0) {
      obj.setValueType = setGenericTypeToJSON(message.setValueType);
    }
    if (message.crdtType !== 0) {
      obj.crdtType = cRDTSetTypeToJSON(message.crdtType);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseMapSetValueRequest(): MapSetValueRequest {
  return { statefulObjectBase: undefined, replicaId: "", valueCrdtType: 0, valueCrdtName: "", functionBase: undefined };
}

export const MapSetValueRequest = {
  encode(message: MapSetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.replicaId !== "") {
      writer.uint32(18).string(message.replicaId);
    }
    if (message.keyString !== undefined) {
      writer.uint32(26).string(message.keyString);
    }
    if (message.keyNumber !== undefined) {
      writer.uint32(33).double(message.keyNumber);
    }
    if (message.valueCrdtType !== 0) {
      writer.uint32(40).int32(message.valueCrdtType);
    }
    if (message.valueCrdtName !== "") {
      writer.uint32(50).string(message.valueCrdtName);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(58).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapSetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapSetValueRequest();
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

          message.replicaId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keyString = reader.string();
          continue;
        case 4:
          if (tag !== 33) {
            break;
          }

          message.keyNumber = reader.double();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.valueCrdtType = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.valueCrdtName = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
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

  fromJSON(object: any): MapSetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
      keyString: isSet(object.keyString) ? String(object.keyString) : undefined,
      keyNumber: isSet(object.keyNumber) ? Number(object.keyNumber) : undefined,
      valueCrdtType: isSet(object.valueCrdtType) ? cRDTSetTypeFromJSON(object.valueCrdtType) : 0,
      valueCrdtName: isSet(object.valueCrdtName) ? String(object.valueCrdtName) : "",
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: MapSetValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    if (message.keyString !== undefined) {
      obj.keyString = message.keyString;
    }
    if (message.keyNumber !== undefined) {
      obj.keyNumber = message.keyNumber;
    }
    if (message.valueCrdtType !== 0) {
      obj.valueCrdtType = cRDTSetTypeToJSON(message.valueCrdtType);
    }
    if (message.valueCrdtName !== "") {
      obj.valueCrdtName = message.valueCrdtName;
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseMapGetValueRequest(): MapGetValueRequest {
  return { statefulObjectBase: undefined, valueCrdtType: 0, functionBase: undefined };
}

export const MapGetValueRequest = {
  encode(message: MapGetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.keyString !== undefined) {
      writer.uint32(18).string(message.keyString);
    }
    if (message.keyNumber !== undefined) {
      writer.uint32(25).double(message.keyNumber);
    }
    if (message.valueCrdtType !== 0) {
      writer.uint32(32).int32(message.valueCrdtType);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapGetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapGetValueRequest();
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

          message.keyString = reader.string();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.keyNumber = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.valueCrdtType = reader.int32() as any;
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

  fromJSON(object: any): MapGetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      keyString: isSet(object.keyString) ? String(object.keyString) : undefined,
      keyNumber: isSet(object.keyNumber) ? Number(object.keyNumber) : undefined,
      valueCrdtType: isSet(object.valueCrdtType) ? cRDTSetTypeFromJSON(object.valueCrdtType) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: MapGetValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.keyString !== undefined) {
      obj.keyString = message.keyString;
    }
    if (message.keyNumber !== undefined) {
      obj.keyNumber = message.keyNumber;
    }
    if (message.valueCrdtType !== 0) {
      obj.valueCrdtType = cRDTSetTypeToJSON(message.valueCrdtType);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseMapGetKeysRequest(): MapGetKeysRequest {
  return { statefulObjectBase: undefined, functionBase: undefined, keyType: 0 };
}

export const MapGetKeysRequest = {
  encode(message: MapGetKeysRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    if (message.keyType !== 0) {
      writer.uint32(24).int32(message.keyType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapGetKeysRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapGetKeysRequest();
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

          message.keyType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MapGetKeysRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      keyType: isSet(object.keyType) ? setGenericTypeFromJSON(object.keyType) : 0,
    };
  },

  toJSON(message: MapGetKeysRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.keyType !== 0) {
      obj.keyType = setGenericTypeToJSON(message.keyType);
    }
    return obj;
  },
};

function createBaseMapGetKeysResponse(): MapGetKeysResponse {
  return { statefulObjectBase: undefined };
}

export const MapGetKeysResponse = {
  encode(message: MapGetKeysResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.keysString !== undefined) {
      SetOrRegisterValueResponseStringValues.encode(message.keysString, writer.uint32(18).fork()).ldelim();
    }
    if (message.keysNumber !== undefined) {
      SetOrRegisterValueResponseNumberValues.encode(message.keysNumber, writer.uint32(26).fork()).ldelim();
    }
    if (message.keysObject !== undefined) {
      SetOrRegisterValueResponseObjectValues.encode(message.keysObject, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapGetKeysResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapGetKeysResponse();
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

          message.keysString = SetOrRegisterValueResponseStringValues.decode(reader, reader.uint32());
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.keysNumber = SetOrRegisterValueResponseNumberValues.decode(reader, reader.uint32());
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.keysObject = SetOrRegisterValueResponseObjectValues.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MapGetKeysResponse {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      keysString: isSet(object.keysString)
        ? SetOrRegisterValueResponseStringValues.fromJSON(object.keysString)
        : undefined,
      keysNumber: isSet(object.keysNumber)
        ? SetOrRegisterValueResponseNumberValues.fromJSON(object.keysNumber)
        : undefined,
      keysObject: isSet(object.keysObject)
        ? SetOrRegisterValueResponseObjectValues.fromJSON(object.keysObject)
        : undefined,
    };
  },

  toJSON(message: MapGetKeysResponse): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.keysString !== undefined) {
      obj.keysString = SetOrRegisterValueResponseStringValues.toJSON(message.keysString);
    }
    if (message.keysNumber !== undefined) {
      obj.keysNumber = SetOrRegisterValueResponseNumberValues.toJSON(message.keysNumber);
    }
    if (message.keysObject !== undefined) {
      obj.keysObject = SetOrRegisterValueResponseObjectValues.toJSON(message.keysObject);
    }
    return obj;
  },
};

function createBaseMapValueResponse(): MapValueResponse {
  return { statefulObjectBase: undefined, hasValue: false };
}

export const MapValueResponse = {
  encode(message: MapValueResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.keyString !== undefined) {
      writer.uint32(18).string(message.keyString);
    }
    if (message.keyNumber !== undefined) {
      writer.uint32(25).double(message.keyNumber);
    }
    if (message.hasValue === true) {
      writer.uint32(32).bool(message.hasValue);
    }
    if (message.valueCrdtName !== undefined) {
      writer.uint32(42).string(message.valueCrdtName);
    }
    if (message.valueCrdtType !== undefined) {
      writer.uint32(48).int32(message.valueCrdtType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapValueResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapValueResponse();
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

          message.keyString = reader.string();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.keyNumber = reader.double();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.hasValue = reader.bool();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.valueCrdtName = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.valueCrdtType = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MapValueResponse {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      keyString: isSet(object.keyString) ? String(object.keyString) : undefined,
      keyNumber: isSet(object.keyNumber) ? Number(object.keyNumber) : undefined,
      hasValue: isSet(object.hasValue) ? Boolean(object.hasValue) : false,
      valueCrdtName: isSet(object.valueCrdtName) ? String(object.valueCrdtName) : undefined,
      valueCrdtType: isSet(object.valueCrdtType) ? cRDTSetTypeFromJSON(object.valueCrdtType) : undefined,
    };
  },

  toJSON(message: MapValueResponse): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.keyString !== undefined) {
      obj.keyString = message.keyString;
    }
    if (message.keyNumber !== undefined) {
      obj.keyNumber = message.keyNumber;
    }
    if (message.hasValue === true) {
      obj.hasValue = message.hasValue;
    }
    if (message.valueCrdtName !== undefined) {
      obj.valueCrdtName = message.valueCrdtName;
    }
    if (message.valueCrdtType !== undefined) {
      obj.valueCrdtType = cRDTSetTypeToJSON(message.valueCrdtType);
    }
    return obj;
  },
};

function createBaseMapDeleteValueRequest(): MapDeleteValueRequest {
  return { statefulObjectBase: undefined, functionBase: undefined };
}

export const MapDeleteValueRequest = {
  encode(message: MapDeleteValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.keyString !== undefined) {
      writer.uint32(18).string(message.keyString);
    }
    if (message.keyNumber !== undefined) {
      writer.uint32(25).double(message.keyNumber);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapDeleteValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapDeleteValueRequest();
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

          message.keyString = reader.string();
          continue;
        case 3:
          if (tag !== 25) {
            break;
          }

          message.keyNumber = reader.double();
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): MapDeleteValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      keyString: isSet(object.keyString) ? String(object.keyString) : undefined,
      keyNumber: isSet(object.keyNumber) ? Number(object.keyNumber) : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: MapDeleteValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.keyString !== undefined) {
      obj.keyString = message.keyString;
    }
    if (message.keyNumber !== undefined) {
      obj.keyNumber = message.keyNumber;
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseMapClearValueRequest(): MapClearValueRequest {
  return { statefulObjectBase: undefined, functionBase: undefined };
}

export const MapClearValueRequest = {
  encode(message: MapClearValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MapClearValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMapClearValueRequest();
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

  fromJSON(object: any): MapClearValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: MapClearValueRequest): unknown {
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

function createBaseSetOrRegisterGetValueRequest(): SetOrRegisterGetValueRequest {
  return { statefulObjectBase: undefined, replicaId: "", type: 0, crdtType: 0, functionBase: undefined };
}

export const SetOrRegisterGetValueRequest = {
  encode(message: SetOrRegisterGetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.replicaId !== "") {
      writer.uint32(18).string(message.replicaId);
    }
    if (message.type !== 0) {
      writer.uint32(24).int32(message.type);
    }
    if (message.crdtType !== 0) {
      writer.uint32(32).int32(message.crdtType);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetOrRegisterGetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetOrRegisterGetValueRequest();
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

          message.replicaId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.type = reader.int32() as any;
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.crdtType = reader.int32() as any;
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

  fromJSON(object: any): SetOrRegisterGetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
      type: isSet(object.type) ? setGenericTypeFromJSON(object.type) : 0,
      crdtType: isSet(object.crdtType) ? cRDTSetTypeFromJSON(object.crdtType) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: SetOrRegisterGetValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    if (message.type !== 0) {
      obj.type = setGenericTypeToJSON(message.type);
    }
    if (message.crdtType !== 0) {
      obj.crdtType = cRDTSetTypeToJSON(message.crdtType);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseCounterAddOrSubtractValueRequest(): CounterAddOrSubtractValueRequest {
  return { statefulObjectBase: undefined, replicaId: "", value: 0, functionBase: undefined };
}

export const CounterAddOrSubtractValueRequest = {
  encode(message: CounterAddOrSubtractValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.replicaId !== "") {
      writer.uint32(18).string(message.replicaId);
    }
    if (message.value !== 0) {
      writer.uint32(24).sint64(message.value);
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterAddOrSubtractValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterAddOrSubtractValueRequest();
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

          message.replicaId = reader.string();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.value = longToNumber(reader.sint64() as Long);
          continue;
        case 4:
          if (tag !== 34) {
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

  fromJSON(object: any): CounterAddOrSubtractValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      replicaId: isSet(object.replicaId) ? String(object.replicaId) : "",
      value: isSet(object.value) ? Number(object.value) : 0,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: CounterAddOrSubtractValueRequest): unknown {
    const obj: any = {};
    if (message.statefulObjectBase !== undefined) {
      obj.statefulObjectBase = StatefulObjectBaseInformation.toJSON(message.statefulObjectBase);
    }
    if (message.replicaId !== "") {
      obj.replicaId = message.replicaId;
    }
    if (message.value !== 0) {
      obj.value = Math.round(message.value);
    }
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    return obj;
  },
};

function createBaseCounterGetValueRequest(): CounterGetValueRequest {
  return { statefulObjectBase: undefined, functionBase: undefined };
}

export const CounterGetValueRequest = {
  encode(message: CounterGetValueRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.statefulObjectBase !== undefined) {
      StatefulObjectBaseInformation.encode(message.statefulObjectBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CounterGetValueRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCounterGetValueRequest();
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

  fromJSON(object: any): CounterGetValueRequest {
    return {
      statefulObjectBase: isSet(object.statefulObjectBase)
        ? StatefulObjectBaseInformation.fromJSON(object.statefulObjectBase)
        : undefined,
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
    };
  },

  toJSON(message: CounterGetValueRequest): unknown {
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

export interface GCounterServiceClient {
  add(request: CounterAddOrSubtractValueRequest, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  getValue(request: CounterGetValueRequest, metadata: Metadata, ...rest: any): Observable<CounterResponse>;
}

export interface GCounterServiceController {
  add(
    request: CounterAddOrSubtractValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CounterResponse> | Observable<CounterResponse> | CounterResponse;

  getValue(
    request: CounterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CounterResponse> | Observable<CounterResponse> | CounterResponse;
}

export function GCounterServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["add", "getValue"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("GCounterService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("GCounterService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const G_COUNTER_SERVICE_NAME = "GCounterService";

export interface PNCounterServiceClient {
  add(request: CounterAddOrSubtractValueRequest, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  subtract(request: CounterAddOrSubtractValueRequest, metadata: Metadata, ...rest: any): Observable<CounterResponse>;

  getValue(request: CounterGetValueRequest, metadata: Metadata, ...rest: any): Observable<CounterResponse>;
}

export interface PNCounterServiceController {
  add(
    request: CounterAddOrSubtractValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CounterResponse> | Observable<CounterResponse> | CounterResponse;

  subtract(
    request: CounterAddOrSubtractValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CounterResponse> | Observable<CounterResponse> | CounterResponse;

  getValue(
    request: CounterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<CounterResponse> | Observable<CounterResponse> | CounterResponse;
}

export function PNCounterServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["add", "subtract", "getValue"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PNCounterService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PNCounterService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const P_NCOUNTER_SERVICE_NAME = "PNCounterService";

export interface MVRegisterServiceClient {
  assign(
    request: SetOrRegisterSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  getValue(
    request: SetOrRegisterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;
}

export interface MVRegisterServiceController {
  assign(
    request: SetOrRegisterSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<SetOrRegisterValueResponse> | Observable<SetOrRegisterValueResponse> | SetOrRegisterValueResponse;

  getValue(
    request: SetOrRegisterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<SetOrRegisterValueResponse> | Observable<SetOrRegisterValueResponse> | SetOrRegisterValueResponse;
}

export function MVRegisterServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["assign", "getValue"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MVRegisterService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MVRegisterService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const M_VREGISTER_SERVICE_NAME = "MVRegisterService";

export interface SetServiceClient {
  add(request: SetOrRegisterSetValueRequest, metadata: Metadata, ...rest: any): Observable<SetOrRegisterValueResponse>;

  removeOrSet(
    request: SetOrRegisterSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;

  getValue(
    request: SetOrRegisterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<SetOrRegisterValueResponse>;
}

export interface SetServiceController {
  add(
    request: SetOrRegisterSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<SetOrRegisterValueResponse> | Observable<SetOrRegisterValueResponse> | SetOrRegisterValueResponse;

  removeOrSet(
    request: SetOrRegisterSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<SetOrRegisterValueResponse> | Observable<SetOrRegisterValueResponse> | SetOrRegisterValueResponse;

  getValue(
    request: SetOrRegisterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<SetOrRegisterValueResponse> | Observable<SetOrRegisterValueResponse> | SetOrRegisterValueResponse;
}

export function SetServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["add", "removeOrSet", "getValue"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("SetService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("SetService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SET_SERVICE_NAME = "SetService";

export interface ORMapServiceClient {
  set(request: MapSetValueRequest, metadata: Metadata, ...rest: any): Observable<MapValueResponse>;

  remove(request: MapDeleteValueRequest, metadata: Metadata, ...rest: any): Observable<AckResponse>;

  get(request: MapGetValueRequest, metadata: Metadata, ...rest: any): Observable<MapValueResponse>;

  has(request: MapGetValueRequest, metadata: Metadata, ...rest: any): Observable<BoolResponse>;

  keys(request: MapGetKeysRequest, metadata: Metadata, ...rest: any): Observable<MapGetKeysResponse>;

  clear(request: MapClearValueRequest, metadata: Metadata, ...rest: any): Observable<AckResponse>;
}

export interface ORMapServiceController {
  set(
    request: MapSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<MapValueResponse> | Observable<MapValueResponse> | MapValueResponse;

  remove(
    request: MapDeleteValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<AckResponse> | Observable<AckResponse> | AckResponse;

  get(
    request: MapGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<MapValueResponse> | Observable<MapValueResponse> | MapValueResponse;

  has(
    request: MapGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<BoolResponse> | Observable<BoolResponse> | BoolResponse;

  keys(
    request: MapGetKeysRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<MapGetKeysResponse> | Observable<MapGetKeysResponse> | MapGetKeysResponse;

  clear(
    request: MapClearValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<AckResponse> | Observable<AckResponse> | AckResponse;
}

export function ORMapServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["set", "remove", "get", "has", "keys", "clear"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ORMapService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ORMapService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const O_RMAP_SERVICE_NAME = "ORMapService";

export interface EWFlagServiceClient {
  assign(request: FlagSetValueRequest, metadata: Metadata, ...rest: any): Observable<FlagSetValueReponse>;

  getValue(request: CounterGetValueRequest, metadata: Metadata, ...rest: any): Observable<FlagSetValueReponse>;
}

export interface EWFlagServiceController {
  assign(
    request: FlagSetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<FlagSetValueReponse> | Observable<FlagSetValueReponse> | FlagSetValueReponse;

  getValue(
    request: CounterGetValueRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<FlagSetValueReponse> | Observable<FlagSetValueReponse> | FlagSetValueReponse;
}

export function EWFlagServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["assign", "getValue"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("EWFlagService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("EWFlagService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const E_WFLAG_SERVICE_NAME = "EWFlagService";

export interface StatefulObjectServiceClient {
  remove(request: DeleteCrdtRequest, metadata: Metadata, ...rest: any): Observable<BoolResponse>;
}

export interface StatefulObjectServiceController {
  remove(
    request: DeleteCrdtRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<BoolResponse> | Observable<BoolResponse> | BoolResponse;
}

export function StatefulObjectServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["remove"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("StatefulObjectService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("StatefulObjectService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const STATEFUL_OBJECT_SERVICE_NAME = "StatefulObjectService";

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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
