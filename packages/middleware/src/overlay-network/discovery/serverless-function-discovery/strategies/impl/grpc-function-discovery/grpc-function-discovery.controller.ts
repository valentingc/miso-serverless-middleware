import { Metadata } from '@grpc/grpc-js';
import { miso } from '@miso/common/dist/grpc/server/index.js';
import { Logger } from '@nestjs/common';
import { Ctx, GrpcService, Payload } from '@nestjs/microservices';
import { GrpcFunctionDiscoveryService } from './grpc-function-discovery.service.js';

@GrpcService('OverlayFunctionDiscovery')
@miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceControllerMethods()
export class GrpcFunctionDiscoveryServiceController
  implements
    miso.overlay.discovery.function.OverlayFunctionDiscoveryServiceController
{
  private readonly logger = new Logger(
    GrpcFunctionDiscoveryServiceController.name,
  );

  constructor(
    private grpcFunctionDiscoveryService: GrpcFunctionDiscoveryService,
  ) {}

  async unregisterServerlessFunction(
    @Payload()
    request: miso.overlay.discovery.function.ServerlessFunctionUnregisterRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Promise<miso.overlay.discovery.function.ServerlessFunctionRegisterResponse> {
    const functionName = request.functionBase?.serverlessFunctionName;
    if (functionName === undefined) {
      throw new Error('serverlessFunctionName is undefined');
    }

    return {
      acknowledged:
        this.grpcFunctionDiscoveryService.removeServerlessFunctionInstance(
          functionName,
          request.podName,
          false,
        ),
    };
  }

  getFunctionInstanceMap() {
    return this.grpcFunctionDiscoveryService.getFunctionInstanceMap();
  }

  async registerServerlessFunction(
    @Payload()
    request: miso.overlay.discovery.function.ServerlessFunctionRegisterRequest,
    @Ctx()
    metadata: Metadata,
    ...rest: any
  ): Promise<miso.overlay.discovery.function.ServerlessFunctionRegisterResponse> {
    if (request.functionBase?.serverlessFunctionName === undefined) {
      throw new Error('serverlessFunctionName is undefined');
    }

    const registerResult =
      await this.grpcFunctionDiscoveryService.registerServerlessFunction(
        request.functionBase?.serverlessFunctionName,
        request.podName,
        request.nodeIp,
        request.nodeName,
        this.grpcFunctionDiscoveryService.hasServerlessFunction(
          request.functionBase?.serverlessFunctionName,
        ),
      );
    const result: miso.overlay.discovery.function.ServerlessFunctionRegisterResponse =
      {
        acknowledged: registerResult,
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
    this.logger.verbose('exchangeMiddlewareServerlessFunctionPodInfo called!!');

    await this.grpcFunctionDiscoveryService.exchangeMiddlewareServerlessFunctionPodInfo(
      request,
    );
    return {};
  }
}
