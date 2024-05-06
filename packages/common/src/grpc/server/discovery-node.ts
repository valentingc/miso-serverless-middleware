/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Void } from "./common";

export interface OverlayNodeDiscoveryHeartbeatRequest {
  srcNodeName: string;
}

export interface OverlayNodeDiscoveryHeartbeatResponse {
  acknowledged: boolean;
}

export const MISO_OVERLAY_DISCOVERY_NODE_PACKAGE_NAME = "miso.overlay.discovery.node";

function createBaseOverlayNodeDiscoveryHeartbeatRequest(): OverlayNodeDiscoveryHeartbeatRequest {
  return { srcNodeName: "" };
}

export const OverlayNodeDiscoveryHeartbeatRequest = {
  encode(message: OverlayNodeDiscoveryHeartbeatRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.srcNodeName !== "") {
      writer.uint32(10).string(message.srcNodeName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OverlayNodeDiscoveryHeartbeatRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOverlayNodeDiscoveryHeartbeatRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.srcNodeName = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): OverlayNodeDiscoveryHeartbeatRequest {
    return { srcNodeName: isSet(object.srcNodeName) ? String(object.srcNodeName) : "" };
  },

  toJSON(message: OverlayNodeDiscoveryHeartbeatRequest): unknown {
    const obj: any = {};
    if (message.srcNodeName !== "") {
      obj.srcNodeName = message.srcNodeName;
    }
    return obj;
  },
};

function createBaseOverlayNodeDiscoveryHeartbeatResponse(): OverlayNodeDiscoveryHeartbeatResponse {
  return { acknowledged: false };
}

export const OverlayNodeDiscoveryHeartbeatResponse = {
  encode(message: OverlayNodeDiscoveryHeartbeatResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.acknowledged === true) {
      writer.uint32(8).bool(message.acknowledged);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): OverlayNodeDiscoveryHeartbeatResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseOverlayNodeDiscoveryHeartbeatResponse();
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

  fromJSON(object: any): OverlayNodeDiscoveryHeartbeatResponse {
    return { acknowledged: isSet(object.acknowledged) ? Boolean(object.acknowledged) : false };
  },

  toJSON(message: OverlayNodeDiscoveryHeartbeatResponse): unknown {
    const obj: any = {};
    if (message.acknowledged === true) {
      obj.acknowledged = message.acknowledged;
    }
    return obj;
  },
};

export interface OverlayNodeDiscoveryServiceClient {
  heartbeat(
    request: OverlayNodeDiscoveryHeartbeatRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<OverlayNodeDiscoveryHeartbeatResponse>;

  init(request: OverlayNodeDiscoveryHeartbeatRequest, metadata: Metadata, ...rest: any): Observable<Void>;
}

export interface OverlayNodeDiscoveryServiceController {
  heartbeat(
    request: OverlayNodeDiscoveryHeartbeatRequest,
    metadata: Metadata,
    ...rest: any
  ):
    | Promise<OverlayNodeDiscoveryHeartbeatResponse>
    | Observable<OverlayNodeDiscoveryHeartbeatResponse>
    | OverlayNodeDiscoveryHeartbeatResponse;

  init(
    request: OverlayNodeDiscoveryHeartbeatRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<Void> | Observable<Void> | Void;
}

export function OverlayNodeDiscoveryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["heartbeat", "init"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OverlayNodeDiscoveryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OverlayNodeDiscoveryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const OVERLAY_NODE_DISCOVERY_SERVICE_NAME = "OverlayNodeDiscoveryService";

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
