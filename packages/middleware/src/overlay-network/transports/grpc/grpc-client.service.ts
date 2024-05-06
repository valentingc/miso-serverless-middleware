import { Channel, credentials } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Injectable, Logger } from '@nestjs/common';
import { ClientGrpcProxy } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { BehaviorSubject, Observable, Subject, firstValueFrom } from 'rxjs';
import { fileURLToPath } from 'url';
import { getProtoFileNameForType } from '../../../utils/grpc-utils.js';
import { jsonMapReplacer } from '../../../utils/json.utils.js';
import { getRelativePathToProjectRoot } from '../../../utils/path-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pathToProtoFile: (fileName: string) => string = (fileName: string) => {
  const path =
    (process.env.NODE_ENV ?? 'development') === 'development-local'
      ? join(
          getRelativePathToProjectRoot(__dirname),
          `../../node_modules/@miso/common/dist/grpc/${fileName}`,
        )
      : join(
          getRelativePathToProjectRoot(__dirname),
          `./node_modules/@miso/common/dist/grpc/${fileName}`,
        );
  return path;
};

export type AllowedGrpcReplicationMethods =
  keyof miso.replication.ReplicationServiceClient;
type DynamicReplicationServiceClient = {
  [K in AllowedGrpcReplicationMethods]: miso.replication.ReplicationServiceClient[K];
};
function isDynamicReplicationServiceClient(
  obj: any,
): obj is DynamicReplicationServiceClient {
  return 'mergeGCounter' in obj;
}

export type AllowedGrpcOverlayFunctionDiscoveryMethods =
  keyof miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceClient;
type DynamicOverlayFunctionDiscoveryServiceClient = {
  [K in AllowedGrpcOverlayFunctionDiscoveryMethods]: miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceClient[K];
};

export type AllowedGrpcOverlayNodeDiscoveryMethods =
  keyof miso.overlay.discovery.node.OverlayNodeDiscoveryServiceClient;
type DynamicOverlayNodeDiscoveryServiceClient = {
  [K in AllowedGrpcOverlayNodeDiscoveryMethods]: miso.overlay.discovery.node.OverlayNodeDiscoveryServiceClient[K];
};
type AllowedGrpcMethods =
  | AllowedGrpcReplicationMethods
  | AllowedGrpcOverlayFunctionDiscoveryMethods
  | AllowedGrpcOverlayNodeDiscoveryMethods;

function isDynamicOverlayFunctionDiscoveryServiceClient(
  obj: any,
): obj is DynamicOverlayFunctionDiscoveryServiceClient {
  return 'registerServerlessFunction' in obj;
}
function isDynamicOverlayNodeDiscoveryServiceClient(
  obj: any,
): obj is DynamicOverlayNodeDiscoveryServiceClient {
  return 'heartbeat' in obj;
}
export enum GrpcClientPackageType {
  PACKAGE_MISO_MIDDLEWARE = 'miso.middleware',
  PACKAGE_MISO_REPLICATION = 'miso.replication',
  PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION = 'miso.overlay.discovery.function',
  PACKAGE_MISO_OVERLAY_DISCOVERY_NODE = 'miso.overlay.discovery.node',
}
@Injectable()
export class GrpcClientService {
  private logger: Logger = new Logger(GrpcClientService.name);
  private readonly grpcClients: Map<string, ClientGrpcProxy> = new Map();
  private readonly grpcChannels: Map<string, Channel> = new Map();
  private readonly streamsSubjects: Map<string, Subject<any>> = new Map();
  private readonly streamObservables: Map<string, Observable<any>> = new Map();

  private _getClientAndService(type: GrpcClientPackageType, ipAddress: string) {
    const grpcClient = this._getGrpcClientForNode(type, ipAddress);
    let grpcService;
    switch (type) {
      case GrpcClientPackageType.PACKAGE_MISO_REPLICATION:
        grpcService =
          grpcClient.getService<miso.replication.ReplicationServiceClient>(
            miso.replication.REPLICATION_SERVICE_NAME,
          ) as DynamicReplicationServiceClient;
        break;
      case GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION:
        grpcService =
          grpcClient.getService<miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceClient>(
            miso.overlay.discovery.function
              .OVERLAY_FUNCTION_DISCOVERY_SERVICE_NAME,
          ) as DynamicOverlayFunctionDiscoveryServiceClient;
        break;
      case GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_NODE:
        grpcService =
          grpcClient.getService<miso.overlay.discovery.node.OverlayNodeDiscoveryServiceClient>(
            miso.overlay.discovery.node.OVERLAY_NODE_DISCOVERY_SERVICE_NAME,
          ) as DynamicOverlayNodeDiscoveryServiceClient;
        break;
    }
    // const replicationService: DynamicReplicationServiceClient =
    //   grpcClient.getService<miso.replication.ReplicationServiceClient>(
    //     miso.replication.REPLICATION_SERVICE_NAME,
    //   ) as DynamicReplicationServiceClient;

    if (grpcService === undefined) {
      throw new Error('Could not get service');
    }
    return { grpcClient, grpcService };
  }

  private getStreamKey(
    ipAddress: string,
    methodName: AllowedGrpcMethods,
  ): string {
    return `stream_${ipAddress}_${methodName}`;
  }

  callStreamingGrpcMethod(
    ipAddress: string,
    method: AllowedGrpcMethods,
    type: GrpcClientPackageType,
    payload: any,
  ) {
    const { grpcService } = this._getClientAndService(type, ipAddress);
    if (
      type === GrpcClientPackageType.PACKAGE_MISO_REPLICATION &&
      isDynamicReplicationServiceClient(grpcService) === false
    ) {
      throw new Error('grpcService is not a DynamicReplicationServiceClient');
    } else if (
      type === GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION &&
      isDynamicOverlayFunctionDiscoveryServiceClient(grpcService) === false
    ) {
      throw new Error(
        'grpcService is not a DynamicOverlayFunctionDiscoveryServiceClient',
      );
    }
    if (!(<any>grpcService)[method]) {
      throw new Error(
        `Method ${method} does not exist on the replication service.`,
      );
    }

    const key = this.getStreamKey(ipAddress, method);
    let subject: Subject<any> | undefined = this.streamsSubjects.get(key);
    if (subject !== undefined) {
      this.logger.verbose('Found existing stream subject for key: ' + key);
      subject.next(payload);
      const observable = this.streamObservables.get(key);
      return {
        sendSubject: subject,
        receiveObservable: observable,
      };
    } else {
      this.logger.debug('Creating new stream subject for key: ' + key);
      subject = new BehaviorSubject<any>({});
      this.streamsSubjects.set(key, subject);
    }
    if (subject === undefined) {
      throw new Error('Could not open stream');
    }

    // send initial message directly
    subject.next(payload);

    const observable = ((<any>grpcService)[method] as any)(subject);
    this.streamObservables.set(key, observable);
    observable.subscribe({
      error: async (err: any) => {
        this.logger.error(`GRPC Stream error for IP ${ipAddress}: ${err}`);
        this.streamsSubjects.delete(key);
        this.streamObservables.delete(key);
        this.grpcChannels.delete(ipAddress);
        this.grpcClients.delete(
          ipAddress + '-' + GrpcClientPackageType.PACKAGE_MISO_REPLICATION,
        );
      },
      complete: () => {
        this.logger.debug(`GRPC Stream completed for key: ${key}`);
        this.streamsSubjects.delete(key);
        this.streamObservables.delete(key);
      },
    });
    return {
      sendSubject: subject,
      receiveObservable: observable,
    };
  }

  async callUnaryGrpcMethod(
    ipAddress: string,
    method: AllowedGrpcMethods,
    type: GrpcClientPackageType,
    payload: any,
  ): Promise<any> {
    const { grpcService } = this._getClientAndService(type, ipAddress);
    if (type === GrpcClientPackageType.PACKAGE_MISO_REPLICATION) {
      if (isDynamicReplicationServiceClient(grpcService) === false) {
        throw new Error('grpcService is not a DynamicReplicationServiceClient');
      }
      if (
        !(<DynamicReplicationServiceClient>grpcService)[
          method as AllowedGrpcReplicationMethods
        ]
      ) {
        throw new Error(
          `Method ${method} does not exist on the replication service.`,
        );
      }
    } else if (
      type === GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_FUNCTION
    ) {
      if (
        isDynamicOverlayFunctionDiscoveryServiceClient(grpcService) === false
      ) {
        throw new Error(
          'grpcService is not a DynamicOverlayFunctionDiscoveryServiceClient',
        );
      }
      if (
        !(<DynamicOverlayFunctionDiscoveryServiceClient>grpcService)[
          method as AllowedGrpcOverlayFunctionDiscoveryMethods
        ]
      ) {
        throw new Error(
          `Method ${method} does not exist on the overlay function discovery service.`,
        );
      }
    }
    this.logger.verbose(
      'Unary GRPC payload: ' + JSON.stringify(payload, jsonMapReplacer),
    );
    const grpcMethodFunction = (<any>grpcService)[method];
    if (typeof grpcMethodFunction === 'function') {
      return firstValueFrom(grpcMethodFunction(payload) as any).catch((err) => {
        this.logger.error(
          'Unary GRPC error, host: ' +
            ipAddress +
            ', method: ' +
            method +
            ', err: ' +
            err,
        );
      });
    } else {
      throw new Error(`gRPC method ${method} not found in the grpc client.`);
    }
  }

  private _getGrpcClientForNode(
    type: GrpcClientPackageType,
    nodeName: string,
  ): ClientGrpcProxy {
    const key = nodeName + '-' + type;
    if (!this.grpcClients.has(key)) {
      this.logger.debug('Need to create GRPC client for node: ' + nodeName);
      const client = this._createGrpcClientForNodeAndType(type, nodeName);
      this.grpcClients.set(key, client);
    } else {
      this.logger.verbose('Using existing GRPC client for node: ' + nodeName);
    }

    const result = this.grpcClients.get(key);
    if (result === undefined) {
      throw new Error('Could not get GRPC Client for node name: ' + nodeName);
    }
    return result;
  }

  private _createGrpcClientForNodeAndType(
    type: GrpcClientPackageType,
    nodeName: string,
  ): ClientGrpcProxy {
    let channel;
    if (!this.grpcChannels.has(nodeName)) {
      this.logger.log('Need to create GRPC channel for node: ' + nodeName);
      channel = new Channel(`${nodeName}:5001`, credentials.createInsecure(), {
        'grpc.default_compression_algorithm': 2,
        'grpc.default_compression_level': 2,
        'grpc.max_send_message_length': 1024 * 1024 * 10,
        'grpc.max_receive_message_length': 1024 * 1024 * 10,
        'grpc.max_concurrent_streams': 4294967295,
        'grpc.enable_retries': 1,
      });

      this.grpcChannels.set(nodeName, channel);
    } else {
      this.logger.debug('Using existing GRPC channel for node: ' + nodeName);
      channel = this.grpcChannels.get(nodeName);
    }

    const grpcClient = new ClientGrpcProxy({
      url: `${nodeName}:5001`,
      package: type,
      channelOptions: {
        channelOverride: channel,
      },
      protoPath: join(
        __dirname,
        pathToProtoFile(getProtoFileNameForType(type)),
      ),
    });
    return grpcClient;
  }
}
