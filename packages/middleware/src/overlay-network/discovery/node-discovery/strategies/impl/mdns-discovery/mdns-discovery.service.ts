import { Void } from '@miso/common/dist/grpc/server/common.js';
import { OverlayNodeDiscoveryHeartbeatResponse } from '@miso/common/dist/grpc/server/discovery-node.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dns from 'dns';
import mDNS from 'multicast-dns';
import os from 'os';
import {
  MiddlewareConfig,
  NodeDiscoveryOptions,
  OverlayOptions,
} from '../../../../../../config/middleware-config.js';
import { jsonMapReplacer } from '../../../../../../utils/json.utils.js';
import { TypedEventEmitter } from '../../../../../../utils/typed-event-emitter.js';
import {
  GrpcClientPackageType,
  GrpcClientService,
} from '../../../../../transports/grpc/grpc-client.service.js';
import { NodeDiscoveryEvents } from '../../../node-discovery-events.interface.js';
import { NodeDiscoveryStrategy } from '../../../node-discovery-strategy.interface.js';
import { MdnsOverlayNodeDiscoveryInstance } from './mdns-discovery-instance.interface.js';

export interface MdnsNetworkInterfaceInfo {
  iface: string;
  ips: string[];
}

@Injectable()
export class MdnsDiscoveryService
  implements NodeDiscoveryStrategy, OnModuleDestroy
{
  public eventEmitter = new TypedEventEmitter<NodeDiscoveryEvents>();
  private logger: Logger = new Logger(MdnsDiscoveryService.name);
  private discoveredIPs: Set<string> = new Set();
  private nodeNameToIPs: Map<string, Set<string>> = new Map();
  private nodeNameToHeartbeatInfo: Map<
    string,
    MdnsOverlayNodeDiscoveryInstance
  > = new Map<string, MdnsOverlayNodeDiscoveryInstance>();
  private mdns;
  private discoveryInterval: NodeJS.Timer | undefined;
  private discoveryOptions: NodeDiscoveryOptions | undefined;
  private thisNodeName: string;

  constructor(
    private readonly configService: ConfigService<MiddlewareConfig>,
    private readonly grpcClientService: GrpcClientService,
  ) {
    this.mdns = mDNS();
    this.discoveryOptions =
      configService.get<OverlayOptions>('overlay')?.discovery.node;
    if (this.discoveryOptions?.thisNodeName === undefined) {
      throw new Error('thisNodeName must be defined');
    }
    this.thisNodeName = this.discoveryOptions?.thisNodeName;
  }

  public onNodeTimeout(nodeName: string) {
    this.logger.log(
      `Timeout for node ${nodeName}, removing from discovered set`,
    );
    const ips = this.nodeNameToIPs.get(nodeName);
    ips?.forEach((ip) => {
      this.discoveredIPs.delete(ip);
    });
    this.nodeNameToIPs.delete(nodeName);
    this.nodeNameToHeartbeatInfo.delete(nodeName);
  }
  public async onNodeHeartbeatRequired(ip: string) {
    this.logger.verbose(`Need to send heartbeat to node ${ip}`);
    const payload: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest =
      {
        srcNodeName: this.discoveryOptions?.thisNodeName ?? 'unknown',
      };
    const res = await this.grpcClientService.callUnaryGrpcMethod(
      ip,
      'heartbeat',
      GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_NODE,
      payload,
    );
    this.logger.verbose('Heartbeat response: ' + JSON.stringify(res));
  }

  public onNodeInitReceived(
    request: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest,
  ): Void {
    this.logger.verbose(`Received init from ${request.srcNodeName}`);
    const info = this.nodeNameToHeartbeatInfo.get(request.srcNodeName);
    if (info === undefined) {
      this.logger.debug(
        `Received init from unknown node ${request.srcNodeName}`,
      );
      return {};
    }
    if (info.initCompleted === true) {
      this.logger.error(
        "Node has restarted! can't re-init, node name: " + request.srcNodeName,
      );
      
      this.logger.debug("Emitting 'middleware:restarted-instance'");
      this.eventEmitter.emit('middleware:restarted-instance', {
        hostIpAddress: this.nodeNameToIPs
          .get(request.srcNodeName)
          ?.values()
          .next().value,

        hostName: request.srcNodeName,
      });
      return {};
    }
    info.initCompleted = true;
    this.nodeNameToHeartbeatInfo.set(request.srcNodeName, info);
    return {};
  }
  public onNodeHeartbeatReceived(
    request: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest,
  ): OverlayNodeDiscoveryHeartbeatResponse {
    const info = this.nodeNameToHeartbeatInfo.get(request.srcNodeName);

    if (info === undefined) {
      this.logger.log(
        `Received heartbeat from unknown node ${request.srcNodeName}`,
      );
      return {
        acknowledged: false,
      };
    }
    info.timerTimeout?.refresh();
    info.timestampLastSeen = Date.now();
    this.logger.verbose(`Received heartbeat from ${request.srcNodeName}`);
    this.nodeNameToHeartbeatInfo.set(request.srcNodeName, info);

    return {
      acknowledged: true,
    };
  }

  getDiscoveredNodesWithIps(): Map<string, Set<string>> {
    return new Map(this.nodeNameToIPs);
  }

  onModuleDestroy() {
    this.logger.debug('Cleaning up MdnsDiscoveryService');
    clearInterval(this.discoveryInterval);
    this.discoveryInterval = undefined;
    if (this.mdns) {
      this.mdns.removeAllListeners();
    }
  }

  private getLocalIPs(): MdnsNetworkInterfaceInfo[] {
    const nets = os.networkInterfaces();
    const results: { [iface: string]: string[] } = {};

    for (const name of Object.keys(nets)) {
      const netInfo = nets[name];

      if (netInfo !== undefined) {
        for (const net of netInfo) {
          // Skip over non-IPv4 and internal addresses, e.g. 127.0.0.1
          if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
              results[name] = [];
            }
            results[name].push(net.address);
          }
        }
      }
    }

    return Object.entries(results).map(([iface, ips]) => ({ iface, ips }));
  }

  async startDiscovery() {
    this.mdns.on('query', (query: mDNS.QueryPacket) => {
      if (
        query.questions.some(
          (q) => q.name === this.discoveryOptions?.serviceName ?? 'unknown',
        )
      ) {
        const ips = this.getLocalIPs().flatMap((iface) => iface.ips);
        this.mdns.respond({
          answers: ips.map((ip) => ({
            name: this.discoveryOptions?.serviceName ?? 'unknown',
            type: 'A',
            ttl: 300,
            data: ip,
          })),
        });
      }
    });
    const getRandomDiscoveryIntervalInSeconds = (
      minSeconds: number,
      maxSeconds: number,
      stepSeconds: number,
    ): number => {
      minSeconds = Math.ceil(minSeconds / stepSeconds);
      maxSeconds = Math.floor(maxSeconds / stepSeconds);
      const interval = Math.floor(
        Math.random() * (maxSeconds - minSeconds + 1) + minSeconds,
      );
      const result = interval * stepSeconds;
      this.logger.log('Random interval: ' + result + ' seconds');
      return result;
    };
    const makeQuery = () => {
      this.logger.warn('Making MDNS query');
      this.mdns.query({
        questions: [
          {
            name: this.discoveryOptions?.serviceName ?? 'unknown',
            type: 'A',
          },
        ],
      });
    };
    makeQuery();
    this.discoveryInterval = setInterval(() => {
      makeQuery();
    }, getRandomDiscoveryIntervalInSeconds(60, 120, 1) * 1000);

    this.mdns.on('response', (response: mDNS.ResponsePacket) => {
      const newIPs: string[] = [];
      const localIps = this.getLocalIPs();

      for (const answer of response.answers) {
        if (
          (answer && answer.name !== this.discoveryOptions?.serviceName) ??
          'unknown'
        ) {
          return;
        }

        if (answer.type === 'A') {
          if (
            this.discoveredIPs.has(answer.data) ||
            localIps.flatMap((v) => v.ips).includes(answer.data)
          ) {
            continue;
          }
          this.discoveredIPs.add(answer.data);
          this.logger.debug(
            `Middleware service found: ${answer.name}@${answer.data}`,
          );
          newIPs.push(answer.data);
        }
      }

      for (const ip of newIPs) {
        dns.reverse(ip, (err, hostnames) => {
          if (err) {
            this.logger.debug(
              `Error performing reverse lookup for ${ip}: ${err.message}`,
            );
            return;
          }

          if (hostnames && hostnames.length > 0) {
            this.logger.verbose(
              `Found middleware service, IP ${ip} corresponds to ${hostnames.join(
                ', ',
              )}`,
            );
            //this.eventEmitter.emit('middleware:discovered-ip', ip);
            let hostname = hostnames[0];
            hostname = hostname.replace(/\.kind/g, '').replace(/\.local/g, '');
            const existingIPs =
              this.nodeNameToIPs.get(hostname) || new Set<string>();
            existingIPs.add(ip);
            this.nodeNameToIPs.set(hostname, existingIPs);
            this.logger.debug("Emitting 'middleware:discovered-instance'");
            this.eventEmitter.emit('middleware:discovered-instance', {
              hostIpAddress: ip,
              hostName: hostname,
            });
            const timestampNow = Date.now();
            this.nodeNameToHeartbeatInfo.set(hostname, {
              timerTimeout: setTimeout(() => {
                this.onNodeTimeout(hostname);
              }, 24 * 60 * 60 * 1000),
              timerHeartbeat: setInterval(() => {
                this.onNodeHeartbeatRequired(ip);
              }, 24 * 60 * 60 * 1000),
              timestampRegistered: timestampNow,
              timestampLastSeen: timestampNow,
              initCompleted: false,
            });
            this.logger.verbose(
              'Current list of discovered middleware instances: ' +
                JSON.stringify(this.nodeNameToIPs, jsonMapReplacer),
            );

            const initPayload: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest =
              {
                srcNodeName: this.thisNodeName,
              };
            this.grpcClientService.callUnaryGrpcMethod(
              ip,
              'init',
              GrpcClientPackageType.PACKAGE_MISO_OVERLAY_DISCOVERY_NODE,
              initPayload,
            );
          } else {
            this.logger.verbose(`IP ${ip} does not have a reverse DNS record.`);
          }
        });
      }
    });
  }
}
