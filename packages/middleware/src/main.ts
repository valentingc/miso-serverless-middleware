import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { AppModule } from './app.module.js';
import { LoggingInterceptor } from './interceptor/logging.interceptor.js';
import { getRelativePathToProjectRoot } from './utils/path-utils.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function bootstrap() {
  const logger = new Logger('main.ts');
  const pathToProtoFile = (fileName: string) =>
    (process.env.NODE_ENV ?? 'development') === 'development-local'
      ? join(
          getRelativePathToProjectRoot(__dirname),
          `../../node_modules/@miso/common/dist/grpc/${fileName}`,
        )
      : join(
          getRelativePathToProjectRoot(__dirname),
          `./node_modules/@miso/common/dist/grpc/${fileName}`,
        );
  logger.verbose('Path to proto file: ' + pathToProtoFile);
  const app = await NestFactory.create(AppModule, {
    logger:
      (process.env.NODE_ENV ?? 'development') === 'development' ||
      (process.env.NODE_ENV ?? 'development') === 'development-local'
        ? ['error', 'warn', 'debug', 'log', 'verbose'] //# , 'debug', 'log', 'verbose'
        : ['error', 'warn'],
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: [
        'miso.common',
        'miso.middleware',
        'miso.replication',
        'miso.overlay.discovery.function',
        'miso.overlay.discovery.node',
      ],
      protoPath: [
        join(__dirname, pathToProtoFile('common.proto')),
        join(__dirname, pathToProtoFile('middleware.proto')),
        join(__dirname, pathToProtoFile('replication.proto')),
        join(__dirname, pathToProtoFile('discovery-function.proto')),
        join(__dirname, pathToProtoFile('discovery-node.proto')),
      ],
      url: '0.0.0.0:5001',
      loader: {
        keepCase: true,
        longs: Number,
        enums: Number,
        defaults: true,
        oneofs: true,
      },
      channelOptions: {
        'grpc.default_compression_algorithm': 2,
        'grpc.default_compression_level': 2,
        'grpc.max_send_message_length': 1024 * 1024 * 100,
        'grpc.max_receive_message_length': 1024 * 1024 * 100,
        'grpc.max_concurrent_streams': 4294967295,
        'grpc.enable_retries': 1,
      },
    },
  });

  app.enableShutdownHooks();
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.startAllMicroservices();
  await app.listen(3001);
}

bootstrap();
