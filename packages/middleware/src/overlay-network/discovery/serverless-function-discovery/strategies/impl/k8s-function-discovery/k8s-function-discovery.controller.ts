import { Metadata } from '@grpc/grpc-js';
import { ServerlessFunctionRegisterResponse } from '@miso/common/dist/grpc/server/discovery-function.js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';

@GrpcService('OverlayFunctionDiscovery')
@miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceControllerMethods()
export class K8sFunctionDiscoveryServiceController
  implements
    miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceController
{
  private readonly logger = new Logger(
    K8sFunctionDiscoveryServiceController.name,
  );

  async unregisterServerlessFunction(
    @Payload()
    request: miso.overlay.discovery.function.ServerlessFunctionUnregisterRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Promise<miso.overlay.discovery.function.ServerlessFunctionRegisterResponse> {
    const result: ServerlessFunctionRegisterResponse = {
      acknowledged: false,
    };
    return result;
  }
  getFunctionInstanceMap(
    request: miso.overlay.discovery.function.Void,
    metadata: Metadata,
    ...rest: any
  ): miso.overlay.discovery.function.ServerlessFunctionFunctionInstanceMapResponse {
    const result: miso.overlay.discovery.function.ServerlessFunctionFunctionInstanceMapResponse =
      {
        items: {},
      };
    return result;
  }
  async registerServerlessFunction(
    @Payload()
    request: miso.overlay.discovery.function.ServerlessFunctionRegisterRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Promise<ServerlessFunctionRegisterResponse> {
    const result: ServerlessFunctionRegisterResponse = {
      acknowledged: false,
    };
    return result;
  }

  async exchangeMiddlewareServerlessFunctionPodInfo(
    @Payload()
    request: miso.overlay.discovery.function.ServerlessFunctionPodInfoRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Promise<miso.overlay.discovery.function.Void> {
    return {};
  }
}
