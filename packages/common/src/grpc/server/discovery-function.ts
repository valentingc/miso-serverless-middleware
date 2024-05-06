/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { ServerlessFunctionBaseInformation } from "./common";
import { Timestamp } from "./google/protobuf/timestamp";

export enum ServerlessFunctionPodInfoRequestType {
  ADDED = 0,
  REMOVED = 1,
  UNRECOGNIZED = -1,
}

export function serverlessFunctionPodInfoRequestTypeFromJSON(object: any): ServerlessFunctionPodInfoRequestType {
  switch (object) {
    case 0:
    case "ADDED":
      return ServerlessFunctionPodInfoRequestType.ADDED;
    case 1:
    case "REMOVED":
      return ServerlessFunctionPodInfoRequestType.REMOVED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ServerlessFunctionPodInfoRequestType.UNRECOGNIZED;
  }
}

export function serverlessFunctionPodInfoRequestTypeToJSON(object: ServerlessFunctionPodInfoRequestType): string {
  switch (object) {
    case ServerlessFunctionPodInfoRequestType.ADDED:
      return "ADDED";
    case ServerlessFunctionPodInfoRequestType.REMOVED:
      return "REMOVED";
    case ServerlessFunctionPodInfoRequestType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface ServerlessFunctionFunctionInstanceMapResponse {
  items: { [key: string]: ServerlessFunctionFunctionInstanceMapResponeItem };
}

export interface ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry {
  key: string;
  value: ServerlessFunctionFunctionInstanceMapResponeItem | undefined;
}

export interface ServerlessFunctionFunctionInstanceMapResponeItem {
  items: ServerlessFunctionInstance[];
}

export interface ServerlessFunctionInstance {
  podName: string;
  nodeName: string;
  nodeIp: string;
  registeredAtTimestamp: Timestamp | undefined;
  lastHeartbeatTimestamp: Timestamp | undefined;
}

export interface Void {
}

export interface ServerlessFunctionUnregisterRequest {
  functionBase: ServerlessFunctionBaseInformation | undefined;
  podName: string;
}

export interface ServerlessFunctionRegisterRequest {
  functionBase: ServerlessFunctionBaseInformation | undefined;
  podName: string;
  nodeName: string;
  nodeIp: string;
}

export interface ServerlessFunctionRegisterResponse {
  acknowledged: boolean;
}

export interface ServerlessFunctionPodInfoMapValueItem {
  podName: string;
  nodeName: string;
  nodeIp: string;
}

export interface ServerlessFunctionPodInfoMapValue {
  items: ServerlessFunctionPodInfoMapValueItem[];
}

export interface ServerlessFunctionPodInfoRequest {
  /** k: serverless function name */
  serverlessFunctionPods: { [key: string]: ServerlessFunctionPodInfoMapValue };
  srcMiddlewarePodName: string;
  srcMiddlewareNodeName: string;
  srcMiddlewareNodeIp: string;
  requestType: ServerlessFunctionPodInfoRequestType;
  firstInstanceofFunction: boolean;
}

export interface ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry {
  key: string;
  value: ServerlessFunctionPodInfoMapValue | undefined;
}

export const MISO_OVERLAY_DISCOVERY_FUNCTION_PACKAGE_NAME = "miso.overlay.discovery.function";

function createBaseServerlessFunctionFunctionInstanceMapResponse(): ServerlessFunctionFunctionInstanceMapResponse {
  return { items: {} };
}

export const ServerlessFunctionFunctionInstanceMapResponse = {
  encode(message: ServerlessFunctionFunctionInstanceMapResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.items).forEach(([key, value]) => {
      ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork(),
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionFunctionInstanceMapResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionFunctionInstanceMapResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.items[entry1.key] = entry1.value;
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

  fromJSON(object: any): ServerlessFunctionFunctionInstanceMapResponse {
    return {
      items: isObject(object.items)
        ? Object.entries(object.items).reduce<{ [key: string]: ServerlessFunctionFunctionInstanceMapResponeItem }>(
          (acc, [key, value]) => {
            acc[key] = ServerlessFunctionFunctionInstanceMapResponeItem.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: ServerlessFunctionFunctionInstanceMapResponse): unknown {
    const obj: any = {};
    if (message.items) {
      const entries = Object.entries(message.items);
      if (entries.length > 0) {
        obj.items = {};
        entries.forEach(([k, v]) => {
          obj.items[k] = ServerlessFunctionFunctionInstanceMapResponeItem.toJSON(v);
        });
      }
    }
    return obj;
  },
};

function createBaseServerlessFunctionFunctionInstanceMapResponse_ItemsEntry(): ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry {
  return { key: "", value: undefined };
}

export const ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry = {
  encode(
    message: ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ServerlessFunctionFunctionInstanceMapResponeItem.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionFunctionInstanceMapResponse_ItemsEntry();
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

          message.value = ServerlessFunctionFunctionInstanceMapResponeItem.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ServerlessFunctionFunctionInstanceMapResponeItem.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ServerlessFunctionFunctionInstanceMapResponse_ItemsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = ServerlessFunctionFunctionInstanceMapResponeItem.toJSON(message.value);
    }
    return obj;
  },
};

function createBaseServerlessFunctionFunctionInstanceMapResponeItem(): ServerlessFunctionFunctionInstanceMapResponeItem {
  return { items: [] };
}

export const ServerlessFunctionFunctionInstanceMapResponeItem = {
  encode(
    message: ServerlessFunctionFunctionInstanceMapResponeItem,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    for (const v of message.items) {
      ServerlessFunctionInstance.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionFunctionInstanceMapResponeItem {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionFunctionInstanceMapResponeItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items.push(ServerlessFunctionInstance.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionFunctionInstanceMapResponeItem {
    return {
      items: Array.isArray(object?.items) ? object.items.map((e: any) => ServerlessFunctionInstance.fromJSON(e)) : [],
    };
  },

  toJSON(message: ServerlessFunctionFunctionInstanceMapResponeItem): unknown {
    const obj: any = {};
    if (message.items?.length) {
      obj.items = message.items.map((e) => ServerlessFunctionInstance.toJSON(e));
    }
    return obj;
  },
};

function createBaseServerlessFunctionInstance(): ServerlessFunctionInstance {
  return { podName: "", nodeName: "", nodeIp: "", registeredAtTimestamp: undefined, lastHeartbeatTimestamp: undefined };
}

export const ServerlessFunctionInstance = {
  encode(message: ServerlessFunctionInstance, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.podName !== "") {
      writer.uint32(10).string(message.podName);
    }
    if (message.nodeName !== "") {
      writer.uint32(18).string(message.nodeName);
    }
    if (message.nodeIp !== "") {
      writer.uint32(26).string(message.nodeIp);
    }
    if (message.registeredAtTimestamp !== undefined) {
      Timestamp.encode(message.registeredAtTimestamp, writer.uint32(34).fork()).ldelim();
    }
    if (message.lastHeartbeatTimestamp !== undefined) {
      Timestamp.encode(message.lastHeartbeatTimestamp, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionInstance {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionInstance();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.podName = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.nodeName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nodeIp = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.registeredAtTimestamp = Timestamp.decode(reader, reader.uint32());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.lastHeartbeatTimestamp = Timestamp.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionInstance {
    return {
      podName: isSet(object.podName) ? String(object.podName) : "",
      nodeName: isSet(object.nodeName) ? String(object.nodeName) : "",
      nodeIp: isSet(object.nodeIp) ? String(object.nodeIp) : "",
      registeredAtTimestamp: isSet(object.registeredAtTimestamp)
        ? fromJsonTimestamp(object.registeredAtTimestamp)
        : undefined,
      lastHeartbeatTimestamp: isSet(object.lastHeartbeatTimestamp)
        ? fromJsonTimestamp(object.lastHeartbeatTimestamp)
        : undefined,
    };
  },

  toJSON(message: ServerlessFunctionInstance): unknown {
    const obj: any = {};
    if (message.podName !== "") {
      obj.podName = message.podName;
    }
    if (message.nodeName !== "") {
      obj.nodeName = message.nodeName;
    }
    if (message.nodeIp !== "") {
      obj.nodeIp = message.nodeIp;
    }
    if (message.registeredAtTimestamp !== undefined) {
      obj.registeredAtTimestamp = fromTimestamp(message.registeredAtTimestamp).toISOString();
    }
    if (message.lastHeartbeatTimestamp !== undefined) {
      obj.lastHeartbeatTimestamp = fromTimestamp(message.lastHeartbeatTimestamp).toISOString();
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

function createBaseServerlessFunctionUnregisterRequest(): ServerlessFunctionUnregisterRequest {
  return { functionBase: undefined, podName: "" };
}

export const ServerlessFunctionUnregisterRequest = {
  encode(message: ServerlessFunctionUnregisterRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.podName !== "") {
      writer.uint32(18).string(message.podName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionUnregisterRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionUnregisterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.podName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionUnregisterRequest {
    return {
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      podName: isSet(object.podName) ? String(object.podName) : "",
    };
  },

  toJSON(message: ServerlessFunctionUnregisterRequest): unknown {
    const obj: any = {};
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.podName !== "") {
      obj.podName = message.podName;
    }
    return obj;
  },
};

function createBaseServerlessFunctionRegisterRequest(): ServerlessFunctionRegisterRequest {
  return { functionBase: undefined, podName: "", nodeName: "", nodeIp: "" };
}

export const ServerlessFunctionRegisterRequest = {
  encode(message: ServerlessFunctionRegisterRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.functionBase !== undefined) {
      ServerlessFunctionBaseInformation.encode(message.functionBase, writer.uint32(10).fork()).ldelim();
    }
    if (message.podName !== "") {
      writer.uint32(18).string(message.podName);
    }
    if (message.nodeName !== "") {
      writer.uint32(26).string(message.nodeName);
    }
    if (message.nodeIp !== "") {
      writer.uint32(34).string(message.nodeIp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionRegisterRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionRegisterRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.functionBase = ServerlessFunctionBaseInformation.decode(reader, reader.uint32());
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.podName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nodeName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.nodeIp = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionRegisterRequest {
    return {
      functionBase: isSet(object.functionBase)
        ? ServerlessFunctionBaseInformation.fromJSON(object.functionBase)
        : undefined,
      podName: isSet(object.podName) ? String(object.podName) : "",
      nodeName: isSet(object.nodeName) ? String(object.nodeName) : "",
      nodeIp: isSet(object.nodeIp) ? String(object.nodeIp) : "",
    };
  },

  toJSON(message: ServerlessFunctionRegisterRequest): unknown {
    const obj: any = {};
    if (message.functionBase !== undefined) {
      obj.functionBase = ServerlessFunctionBaseInformation.toJSON(message.functionBase);
    }
    if (message.podName !== "") {
      obj.podName = message.podName;
    }
    if (message.nodeName !== "") {
      obj.nodeName = message.nodeName;
    }
    if (message.nodeIp !== "") {
      obj.nodeIp = message.nodeIp;
    }
    return obj;
  },
};

function createBaseServerlessFunctionRegisterResponse(): ServerlessFunctionRegisterResponse {
  return { acknowledged: false };
}

export const ServerlessFunctionRegisterResponse = {
  encode(message: ServerlessFunctionRegisterResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.acknowledged === true) {
      writer.uint32(8).bool(message.acknowledged);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionRegisterResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionRegisterResponse();
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

  fromJSON(object: any): ServerlessFunctionRegisterResponse {
    return { acknowledged: isSet(object.acknowledged) ? Boolean(object.acknowledged) : false };
  },

  toJSON(message: ServerlessFunctionRegisterResponse): unknown {
    const obj: any = {};
    if (message.acknowledged === true) {
      obj.acknowledged = message.acknowledged;
    }
    return obj;
  },
};

function createBaseServerlessFunctionPodInfoMapValueItem(): ServerlessFunctionPodInfoMapValueItem {
  return { podName: "", nodeName: "", nodeIp: "" };
}

export const ServerlessFunctionPodInfoMapValueItem = {
  encode(message: ServerlessFunctionPodInfoMapValueItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.podName !== "") {
      writer.uint32(10).string(message.podName);
    }
    if (message.nodeName !== "") {
      writer.uint32(26).string(message.nodeName);
    }
    if (message.nodeIp !== "") {
      writer.uint32(34).string(message.nodeIp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionPodInfoMapValueItem {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionPodInfoMapValueItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.podName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.nodeName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.nodeIp = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionPodInfoMapValueItem {
    return {
      podName: isSet(object.podName) ? String(object.podName) : "",
      nodeName: isSet(object.nodeName) ? String(object.nodeName) : "",
      nodeIp: isSet(object.nodeIp) ? String(object.nodeIp) : "",
    };
  },

  toJSON(message: ServerlessFunctionPodInfoMapValueItem): unknown {
    const obj: any = {};
    if (message.podName !== "") {
      obj.podName = message.podName;
    }
    if (message.nodeName !== "") {
      obj.nodeName = message.nodeName;
    }
    if (message.nodeIp !== "") {
      obj.nodeIp = message.nodeIp;
    }
    return obj;
  },
};

function createBaseServerlessFunctionPodInfoMapValue(): ServerlessFunctionPodInfoMapValue {
  return { items: [] };
}

export const ServerlessFunctionPodInfoMapValue = {
  encode(message: ServerlessFunctionPodInfoMapValue, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.items) {
      ServerlessFunctionPodInfoMapValueItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionPodInfoMapValue {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionPodInfoMapValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.items.push(ServerlessFunctionPodInfoMapValueItem.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionPodInfoMapValue {
    return {
      items: Array.isArray(object?.items)
        ? object.items.map((e: any) => ServerlessFunctionPodInfoMapValueItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: ServerlessFunctionPodInfoMapValue): unknown {
    const obj: any = {};
    if (message.items?.length) {
      obj.items = message.items.map((e) => ServerlessFunctionPodInfoMapValueItem.toJSON(e));
    }
    return obj;
  },
};

function createBaseServerlessFunctionPodInfoRequest(): ServerlessFunctionPodInfoRequest {
  return {
    serverlessFunctionPods: {},
    srcMiddlewarePodName: "",
    srcMiddlewareNodeName: "",
    srcMiddlewareNodeIp: "",
    requestType: 0,
    firstInstanceofFunction: false,
  };
}

export const ServerlessFunctionPodInfoRequest = {
  encode(message: ServerlessFunctionPodInfoRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.serverlessFunctionPods).forEach(([key, value]) => {
      ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry.encode(
        { key: key as any, value },
        writer.uint32(10).fork(),
      ).ldelim();
    });
    if (message.srcMiddlewarePodName !== "") {
      writer.uint32(18).string(message.srcMiddlewarePodName);
    }
    if (message.srcMiddlewareNodeName !== "") {
      writer.uint32(26).string(message.srcMiddlewareNodeName);
    }
    if (message.srcMiddlewareNodeIp !== "") {
      writer.uint32(34).string(message.srcMiddlewareNodeIp);
    }
    if (message.requestType !== 0) {
      writer.uint32(40).int32(message.requestType);
    }
    if (message.firstInstanceofFunction === true) {
      writer.uint32(48).bool(message.firstInstanceofFunction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ServerlessFunctionPodInfoRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionPodInfoRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          const entry1 = ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.serverlessFunctionPods[entry1.key] = entry1.value;
          }
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.srcMiddlewarePodName = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.srcMiddlewareNodeName = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.srcMiddlewareNodeIp = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.requestType = reader.int32() as any;
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.firstInstanceofFunction = reader.bool();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionPodInfoRequest {
    return {
      serverlessFunctionPods: isObject(object.serverlessFunctionPods)
        ? Object.entries(object.serverlessFunctionPods).reduce<{ [key: string]: ServerlessFunctionPodInfoMapValue }>(
          (acc, [key, value]) => {
            acc[key] = ServerlessFunctionPodInfoMapValue.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
      srcMiddlewarePodName: isSet(object.srcMiddlewarePodName) ? String(object.srcMiddlewarePodName) : "",
      srcMiddlewareNodeName: isSet(object.srcMiddlewareNodeName) ? String(object.srcMiddlewareNodeName) : "",
      srcMiddlewareNodeIp: isSet(object.srcMiddlewareNodeIp) ? String(object.srcMiddlewareNodeIp) : "",
      requestType: isSet(object.requestType) ? serverlessFunctionPodInfoRequestTypeFromJSON(object.requestType) : 0,
      firstInstanceofFunction: isSet(object.firstInstanceofFunction) ? Boolean(object.firstInstanceofFunction) : false,
    };
  },

  toJSON(message: ServerlessFunctionPodInfoRequest): unknown {
    const obj: any = {};
    if (message.serverlessFunctionPods) {
      const entries = Object.entries(message.serverlessFunctionPods);
      if (entries.length > 0) {
        obj.serverlessFunctionPods = {};
        entries.forEach(([k, v]) => {
          obj.serverlessFunctionPods[k] = ServerlessFunctionPodInfoMapValue.toJSON(v);
        });
      }
    }
    if (message.srcMiddlewarePodName !== "") {
      obj.srcMiddlewarePodName = message.srcMiddlewarePodName;
    }
    if (message.srcMiddlewareNodeName !== "") {
      obj.srcMiddlewareNodeName = message.srcMiddlewareNodeName;
    }
    if (message.srcMiddlewareNodeIp !== "") {
      obj.srcMiddlewareNodeIp = message.srcMiddlewareNodeIp;
    }
    if (message.requestType !== 0) {
      obj.requestType = serverlessFunctionPodInfoRequestTypeToJSON(message.requestType);
    }
    if (message.firstInstanceofFunction === true) {
      obj.firstInstanceofFunction = message.firstInstanceofFunction;
    }
    return obj;
  },
};

function createBaseServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry(): ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry {
  return { key: "", value: undefined };
}

export const ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry = {
  encode(
    message: ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      ServerlessFunctionPodInfoMapValue.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number,
  ): ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry();
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

          message.value = ServerlessFunctionPodInfoMapValue.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? ServerlessFunctionPodInfoMapValue.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: ServerlessFunctionPodInfoRequest_ServerlessFunctionPodsEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = ServerlessFunctionPodInfoMapValue.toJSON(message.value);
    }
    return obj;
  },
};

export interface OverlayFunctionDiscoveryServiceClient {
  registerServerlessFunction(
    request: ServerlessFunctionRegisterRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<ServerlessFunctionRegisterResponse>;

  unregisterServerlessFunction(
    request: ServerlessFunctionUnregisterRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<ServerlessFunctionRegisterResponse>;

  exchangeMiddlewareServerlessFunctionPodInfo(
    request: ServerlessFunctionPodInfoRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<Void>;

  getFunctionInstanceMap(
    request: Void,
    metadata: Metadata,
    ...rest: any
  ): Observable<ServerlessFunctionFunctionInstanceMapResponse>;
}

export interface OverlayFunctionDiscoveryServiceController {
  registerServerlessFunction(
    request: ServerlessFunctionRegisterRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<ServerlessFunctionRegisterResponse>
    | Observable<ServerlessFunctionRegisterResponse>
    | ServerlessFunctionRegisterResponse;

  unregisterServerlessFunction(
    request: ServerlessFunctionUnregisterRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<ServerlessFunctionRegisterResponse>
    | Observable<ServerlessFunctionRegisterResponse>
    | ServerlessFunctionRegisterResponse;

  exchangeMiddlewareServerlessFunctionPodInfo(
    request: ServerlessFunctionPodInfoRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<Void> | Observable<Void> | Void;

  getFunctionInstanceMap(
    request: Void,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<ServerlessFunctionFunctionInstanceMapResponse>
    | Observable<ServerlessFunctionFunctionInstanceMapResponse>
    | ServerlessFunctionFunctionInstanceMapResponse;
}

export function OverlayFunctionDiscoveryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "registerServerlessFunction",
      "unregisterServerlessFunction",
      "exchangeMiddlewareServerlessFunctionPodInfo",
      "getFunctionInstanceMap",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OverlayFunctionDiscoveryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OverlayFunctionDiscoveryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const OVERLAY_FUNCTION_DISCOVERY_SERVICE_NAME = "OverlayFunctionDiscoveryService";

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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
