import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  MiddlewareConfig,
  OverlayOptions,
} from '../../../config/middleware-config.js';
import { MdnsDiscoveryModule } from './strategies/impl/mdns-discovery/mdns-discovery.module.js';
import { MdnsDiscoveryService } from './strategies/impl/mdns-discovery/mdns-discovery.service.js';

@Module({})
export class NodeDiscoveryModule {
  static forRoot(): DynamicModule {
    return {
      module: NodeDiscoveryModule,
      imports: [ConfigModule, MdnsDiscoveryModule],
      providers: [
        {
          provide: 'OverlayNodeDiscoveryService',
          useFactory: (
            configService: ConfigService<MiddlewareConfig>,
            mdnsService: MdnsDiscoveryService,
          ) => {
            const overlayOptions: OverlayOptions | undefined =
              configService.get<OverlayOptions>('overlay');
            const type = overlayOptions?.discovery.node.type;
            console.log('Node discovery type? ' + type);
            switch (type) {
              case 'mdns-node-discovery':
                return mdnsService;
              default:
                throw new Error('Unsupported node discovery strategy');
            }
          },
          inject: [ConfigService, MdnsDiscoveryService],
        },
      ],
      exports: [
        {
          provide: 'OverlayNodeDiscoveryService',
          useFactory: (
            configService: ConfigService<MiddlewareConfig>,
            mdnsService: MdnsDiscoveryService,
          ) => {
            const overlayOptions: OverlayOptions | undefined =
              configService.get<OverlayOptions>('overlay');
            const type = overlayOptions?.discovery.node.type;
            console.log('Node discovery type? ' + type);
            switch (type) {
              case 'mdns-node-discovery':
                return mdnsService;
              default:
                throw new Error('Unsupported node discovery strategy');
            }
          },
          inject: [ConfigService, MdnsDiscoveryService],
        },
        MdnsDiscoveryModule,
      ],
    };
  }
}
