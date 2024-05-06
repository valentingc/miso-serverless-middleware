import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MiddlewareConfig,
  OverlayOptions,
} from '../../../config/middleware-config.js';
import { GrpcFunctionDiscoveryModule } from './strategies/impl/grpc-function-discovery/grpc-function-discovery.module.js';
import { GrpcFunctionDiscoveryService } from './strategies/impl/grpc-function-discovery/grpc-function-discovery.service.js';

@Module({})
export class FunctionDiscoveryModule {
  static forRoot(): DynamicModule {
    return {
      module: FunctionDiscoveryModule,
      imports: [ConfigModule, GrpcFunctionDiscoveryModule],
      providers: [
        {
          provide: 'OverlayFunctionDiscoveryService',
          useFactory: (
            configService: ConfigService<MiddlewareConfig>,
            grpcService: GrpcFunctionDiscoveryService,
          ) => {
            const type =
              configService.get<OverlayOptions>('overlay')?.discovery.function
                .type;
            console.log('Function discovery type? ' + type);
            switch (type) {
              case 'grpc-function-discovery':
                return grpcService;
              default:
                throw new Error('Unsupported function discovery strategy');
            }
          },
          inject: [ConfigService, GrpcFunctionDiscoveryService],
        },
      ],
      exports: [
        {
          provide: 'OverlayFunctionDiscoveryService',
          useFactory: (
            configService: ConfigService<MiddlewareConfig>,
            grpcService: GrpcFunctionDiscoveryService,
          ) => {
            const type =
              configService.get<OverlayOptions>('overlay')?.discovery.function
                .type;
            console.log('Function discovery type? ' + type);
            switch (type) {
              case 'grpc-function-discovery':
                return grpcService;
              default:
                throw new Error('Unsupported function discovery strategy');
            }
          },
          inject: [ConfigService, GrpcFunctionDiscoveryService],
        },
        GrpcFunctionDiscoveryModule,
      ],
    };
  }
}
