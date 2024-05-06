import * as grpc from '@grpc/grpc-js';
import { credentials } from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as discoveryFunctionGrpcTypes from '@miso/common/dist/grpc/client/discovery-function.js';
import * as middlewareGrpcTypes from '@miso/common/dist/grpc/client/middleware';
import { BoolResponse } from '@miso/common/dist/grpc/client/miso/common/BoolResponse.js';
import { DeleteCrdtRequest } from '@miso/common/dist/grpc/client/miso/middleware/DeleteCrdtRequest.js';
import { ServerlessFunctionRegisterRequest } from '@miso/common/dist/grpc/client/miso/overlay/discovery/function/ServerlessFunctionRegisterRequest.js';
import { ServerlessFunctionRegisterResponse } from '@miso/common/dist/grpc/client/miso/overlay/discovery/function/ServerlessFunctionRegisterResponse.js';
import { ServerlessFunctionUnregisterRequest } from '@miso/common/dist/grpc/client/miso/overlay/discovery/function/ServerlessFunctionUnregisterRequest.js';
import * as replicationGrpcTypes from '@miso/common/dist/grpc/client/replication';
import { createHash } from 'crypto';
import { join } from 'path';
import { Logger } from 'winston';
import { IStatefulObjectProxy } from './IStatefulObjectProxy';
import {
  StatefulObjectConfiguration,
  getConfig,
} from './config/StatefulObjectConfiguration';
import { ICrdtProxy } from './proxies/ICrdtProxy';
import { GCounterProxy } from './proxies/counters/GCounterProxy';
import { PNCounterProxy } from './proxies/counters/PNCounterProxy';
import { EWFlagProxy } from './proxies/flag/EWFlagProxy';
import { MVRegisterProxy } from './proxies/registers/MVRegister/MVRegisterProxy';
import { GSetProxy } from './proxies/sets/GSet/GSetProxy';
import { ORSetProxy } from './proxies/sets/ORSet/ORSetProxy';
import { createLoggingInstance } from './proxies/shared/LoggingUtils';

export class StatefulObjectProxy implements IStatefulObjectProxy {
  private _id: string;
  private _serverlessFunctionName: string;
  private _crdtMap: Map<string, ICrdtProxy>;
  private _config: StatefulObjectConfiguration;
  private _middlewareProto: middlewareGrpcTypes.ProtoGrpcType;
  private _discoveryFunctionProto: discoveryFunctionGrpcTypes.ProtoGrpcType;
  private _replicationProto: replicationGrpcTypes.ProtoGrpcType;
  private logger: Logger;
  private channel: grpc.Channel | undefined;
  private interval: NodeJS.Timer | undefined;

  constructor({
    id,
    config,
    protoFilePath,
  }: {
    id?: string;
    config?: StatefulObjectConfiguration;
    protoFilePath?: string;
  } = {}) {
    this.logger = createLoggingInstance(StatefulObjectProxy);
    this._crdtMap = new Map();

    this._config = config ? config : getConfig();
    this.logger.debug('SDK configuration: ' + JSON.stringify(this._config));

    this.setChannel();

    this.logger.debug(
      'GRPC channel created, connectivity state: ' +
        this.channel?.getConnectivityState(false),
    );
    if (id !== undefined) {
      this._id = id;
    } else {
      this._id = this.generateIdFromFunctionName(this._config.functionName);
      this.logger.debug(
        `Stateful Object id auto-generated from fn name (${this._config.functionName}): ` +
          this._id,
      );
    }

    this._serverlessFunctionName = this.config.functionName;

    const middlewarePackageDefinition = protoLoader.loadSync([
      protoFilePath !== undefined
        ? join(protoFilePath, 'common.proto')
        : './node_modules/@miso/common/dist/grpc/common.proto',
      protoFilePath !== undefined
        ? join(protoFilePath, 'middleware.proto')
        : './node_modules/@miso/common/dist/grpc/middleware.proto',
      protoFilePath !== undefined
        ? join(protoFilePath, 'replication.proto')
        : './node_modules/@miso/common/dist/grpc/replication.proto',
      protoFilePath !== undefined
        ? join(protoFilePath, 'discovery-function.proto')
        : './node_modules/@miso/common/dist/grpc/discovery-function.proto',
    ]);
    this._middlewareProto = grpc.loadPackageDefinition(
      middlewarePackageDefinition,
    ) as unknown as middlewareGrpcTypes.ProtoGrpcType;
    this._replicationProto = grpc.loadPackageDefinition(
      middlewarePackageDefinition,
    ) as unknown as replicationGrpcTypes.ProtoGrpcType;
    this._discoveryFunctionProto = grpc.loadPackageDefinition(
      middlewarePackageDefinition,
    ) as unknown as discoveryFunctionGrpcTypes.ProtoGrpcType;
  }

  private setChannel() {
    this.channel = new grpc.Channel(
      `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
      credentials.createInsecure(),
      {
        'grpc.default_compression_algorithm': 2,
        'grpc.default_compression_level': 2,
        'grpc.max_send_message_length': 1024 * 1024 * 10,
        'grpc.max_receive_message_length': 1024 * 1024 * 10,
        'grpc.max_concurrent_streams': 4294967295,
        // 'grpc.enable_retries': 0,
      },
    );
  }
  getChannel(): grpc.Channel | undefined {
    return this.channel;
  }
  get config() {
    return this._config;
  }
  id() {
    return this._id;
  }
  serverlessFunctionName() {
    return this._serverlessFunctionName;
  }
  getCrdts(): Map<string, ICrdtProxy> {
    return this._crdtMap;
  }

  generateIdFromFunctionName(name: string) {
    const hash = createHash('sha256');
    hash.update(name);
    return hash.digest('hex');
  }

  async deleteCrdt(name: string): Promise<BoolResponse> {
    return new Promise<BoolResponse>((resolve, reject) => {
      this.logger.debug('deleteCrdt for fn name: ' + this.config.functionName);
      const grpcService =
        new this._middlewareProto.miso.middleware.StatefulObjectService(
          `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
          credentials.createInsecure(),
          {
            channelOverride: this.channel,
          },
        );

      const payload: DeleteCrdtRequest = {
        functionBase: {
          serverlessFunctionName: this.config.functionName,
        },
        statefulObjectBase: {
          crdtName: name,
          statefulObjectId: this._id,
        },
      };
      this.logger.debug(
        'ServerlessFunctionRegisterRequest: ' + JSON.stringify(payload),
      );
      grpcService.Remove(payload, (err, response) => {
        if (err) {
          return reject(err);
        }
        if (response === undefined) {
          return reject('No response receied from middleware');
        }
        this._crdtMap.delete(name);
        return resolve(response);
      });
    });
  }

  async registerServerlessFunction(): Promise<ServerlessFunctionRegisterResponse> {
    return new Promise<ServerlessFunctionRegisterResponse>(
      (resolve, reject) => {
        this.logger.debug(
          'registerServerlessFunction for fn name: ' + this.config.functionName,
        );
        const grpcService =
          new this._discoveryFunctionProto.miso.overlay.discovery.function.OverlayFunctionDiscoveryService(
            `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
            credentials.createInsecure(),
            {
              channelOverride: this.channel,
            },
          );

        const payload: ServerlessFunctionRegisterRequest = {
          functionBase: {
            serverlessFunctionName: this.config.functionName,
          },
          nodeName: this.config.middlewareNodeName,
          nodeIp: this.config.middlewareNodeIpAddress,
          podName: this.config.replicaId,
        };
        this.logger.debug(
          'ServerlessFunctionRegisterRequest: ' + JSON.stringify(payload),
        );
        grpcService.registerServerlessFunction(payload, (err, response) => {
          if (err) {
            return reject(err);
          }
          if (response === undefined) {
            return reject('No response receied from middleware');
          }
          return resolve(response);
        });
      },
    );
  }

  async unregisterServerlessFunction(): Promise<ServerlessFunctionRegisterResponse> {
    return new Promise<ServerlessFunctionRegisterResponse>(
      (resolve, reject) => {
        this.logger.debug(
          'unregisterServerlessFunction for fn name: ' +
            this.config.functionName,
        );
        const grpcService =
          new this._discoveryFunctionProto.miso.overlay.discovery.function.OverlayFunctionDiscoveryService(
            `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
            credentials.createInsecure(),
            {
              channelOverride: this.channel,
            },
          );

        const payload: ServerlessFunctionUnregisterRequest = {
          functionBase: {
            serverlessFunctionName: this.config.functionName,
          },
          podName: this.config.replicaId,
        };
        this.logger.debug(
          'ServerlessFunctionUnregisterRequest: ' + JSON.stringify(payload),
        );
        grpcService.unregisterServerlessFunction(payload, (err, response) => {
          if (err) {
            return reject(err);
          }
          if (response === undefined) {
            return reject('No response receied from middleware');
          }
          return resolve(response);
        });
      },
    );
  }

  getPNCounter(name: string): PNCounterProxy {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as PNCounterProxy;
    }
    const grpcPNCounterService =
      new this._middlewareProto.miso.middleware.PNCounterService(
        `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
        credentials.createInsecure(),
        {
          channelOverride: this.channel,
        },
      );

    const proxy = PNCounterProxy.create(name, this, grpcPNCounterService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }

  getGCounter(name: string): GCounterProxy {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as GCounterProxy;
    }
    const gCounterService =
      new this._middlewareProto.miso.middleware.GCounterService(
        `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
        credentials.createInsecure(),
        {
          channelOverride: this.channel,
        },
      );

    const proxy = GCounterProxy.create(name, this, gCounterService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }

  getMVRegister<T extends string | number | object>(
    name: string,
  ): MVRegisterProxy<T> {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as MVRegisterProxy<T>;
    }
    const gCounterService =
      new this._middlewareProto.miso.middleware.MVRegisterService(
        `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
        credentials.createInsecure(),
        {
          channelOverride: this.channel,
        },
      );

    const proxy = MVRegisterProxy.create<T>(name, this, gCounterService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }

  getGSet<T extends string | number | object>(name: string): GSetProxy<T> {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as GSetProxy<T>;
    }
    const setService = new this._middlewareProto.miso.middleware.SetService(
      `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
      credentials.createInsecure(),
      {
        channelOverride: this.channel,
      },
    );

    const proxy = GSetProxy.create<T>(name, this, setService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }

  getORSet<T extends string | number | object>(name: string): ORSetProxy<T> {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as ORSetProxy<T>;
    }
    const setService = new this._middlewareProto.miso.middleware.SetService(
      `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
      credentials.createInsecure(),
      {
        channelOverride: this.channel,
      },
    );

    const proxy = ORSetProxy.create<T>(name, this, setService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }

  getEWFlag(name: string): EWFlagProxy {
    if (this._crdtMap.has(name)) {
      return this._crdtMap.get(name) as EWFlagProxy;
    }
    const ewFlagService =
      new this._middlewareProto.miso.middleware.EWFlagService(
        `${this._config.middlewareNodeIpAddress}:${this._config.middlewareNodePort}`,
        credentials.createInsecure(),
        {
          channelOverride: this.channel,
        },
      );

    const proxy = EWFlagProxy.create(name, this, ewFlagService);
    this._crdtMap.set(name, proxy);

    return proxy;
  }
}
