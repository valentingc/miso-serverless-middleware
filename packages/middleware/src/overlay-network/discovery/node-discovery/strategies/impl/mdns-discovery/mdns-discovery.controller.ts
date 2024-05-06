import { Metadata } from '@grpc/grpc-js';
import { Void } from '@miso/common/dist/grpc/server/common.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { MdnsDiscoveryService } from './mdns-discovery.service.js';

@GrpcService('OverlayNodeDiscoveryService')
@miso.overlay.discovery.node.OverlayNodeDiscoveryServiceControllerMethods()
export class MdnsOverlayNodeDiscoveryServiceController
  implements miso.overlay.discovery.node.OverlayNodeDiscoveryServiceController
{
  private readonly logger = new Logger(
    MdnsOverlayNodeDiscoveryServiceController.name,
  );

  constructor(private mdnsNodeDiscoveryService: MdnsDiscoveryService) {}

  heartbeat(
    @Payload()
    request: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatResponse {
    return this.mdnsNodeDiscoveryService.onNodeHeartbeatReceived(request);
  }

  init(
    @Payload()
    request: miso.overlay.discovery.node.OverlayNodeDiscoveryHeartbeatRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Void {
    return this.mdnsNodeDiscoveryService.onNodeInitReceived(request);
  }
}
