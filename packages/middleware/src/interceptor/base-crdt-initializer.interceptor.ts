import { CRDTSetType } from '@miso/common/dist/grpc/server/common.js';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  NestInterceptor,
  Type,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ReplicationGrpcController } from '../controllers/replicationGrpc/ReplicationGrpc.controller.js';
import { ObjectsService } from '../objects/objects.service.js';
import { StatefulObject } from '../objects/stateful-object.js';
import { FunctionDiscoveryStrategy } from '../overlay-network/discovery/serverless-function-discovery/function-discovery-strategy.interface.js';
import {
  AllowedGrpcReplicationMethods,
  GrpcClientPackageType,
  GrpcClientService,
} from '../overlay-network/transports/grpc/grpc-client.service.js';
import { MiddlewareInstance } from '../replication/interfaces/middleware-instance.interface.js';
import { jsonMapReplacer } from '../utils/json.utils.js';

@Injectable()
export abstract class BaseCrdtInitializerInterceptor
  implements NestInterceptor
{
  protected logger: Logger;

  constructor(
    protected readonly objectService: ObjectsService,
    @Inject('OverlayFunctionDiscoveryService')
    protected readonly functionDiscoveryService: FunctionDiscoveryStrategy,
    protected readonly grpcClientService: GrpcClientService,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  protected abstract getPayloadAndGrpcMethod(
    clazz: Type<any>,
    crdtName: string,
    statefulObject: StatefulObject,
    request: any,
  ): { payload: any; grpcMethod: AllowedGrpcReplicationMethods };

  protected abstract setRetrievedCrdtData(
    data: any,
    clazz: Type<any>,
    statefulObject: StatefulObject,
    crdSetType?: CRDTSetType,
  ): void;

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToRpc().getData();
    if (context.getArgByIndex(0) instanceof Observable === false) {
      const crdtName = request.statefulObjectBase?.crdtName;
      if (!crdtName) {
        return next.handle();
      }
      this.logger.debug(
        `Trying to inject CRDT into request: ${JSON.stringify(request)}`,
      );
      const statefulObject = request.statefulObject;

      const clazz = context.getClass();

      if (clazz.name === ReplicationGrpcController.name) {
        this.logger.debug('No need to initialize retrieve/merging of CRDT');
        return next.handle();
      }

      if (statefulObject.hasCrdt(crdtName) === false) {
        this.logger.log(
          "Stateful object does not have CRDT '" +
            crdtName +
            "', need to check if we can retrieve from others",
        );
        const replicationTargets: Set<MiddlewareInstance> =
          await this.functionDiscoveryService.getReplicationTargets(
            statefulObject.serverlessFunctionName,
          );
        this.logger.debug(
          'Replication targets: ' +
            JSON.stringify(replicationTargets, jsonMapReplacer),
        );
        const payloadAndMethod = this.getPayloadAndGrpcMethod(
          clazz,
          crdtName,
          statefulObject,
          request,
        );
        if (!payloadAndMethod) {
          this.logger.log(
            'Could not initialize CRDT because the payload and grpc method could not be determined',
          );

          return next.handle();
        }

        for (const target of replicationTargets) {
          try {
            const res = await this.grpcClientService
              .callUnaryGrpcMethod(
                target.hostIpAddress,
                payloadAndMethod.grpcMethod,
                GrpcClientPackageType.PACKAGE_MISO_REPLICATION,
                payloadAndMethod.payload,
              )
              .catch((err) => {
                this.logger.error(
                  "Error (Promise) while initializing CRDT: '" + err + "'",
                );
                return;
              });
            if (
              res === undefined ||
              res === null ||
              res?.hasValue?.response === false
            ) {
              this.logger.log(
                'Could not retrieve CRDT data from node: ' + target.hostName,
              );
              continue;
            }
            this.logger.log(
              `Retrieved CRDT state from other node (${target.hostName}): ` +
                JSON.stringify(res, jsonMapReplacer),
            );
            this.setRetrievedCrdtData(
              res,
              clazz,
              statefulObject,
              request.crdtType ?? undefined,
            );
            break;
          } catch (error) {
            this.logger.error("Error while initializing CRDT: '" + error + "'");
          }
        }
      } else {
        this.logger.debug(
          "Stateful Object has CRDT: '" +
            crdtName +
            "', no need to retrieve from others",
        );
      }
    }

    return next.handle();
  }
}
