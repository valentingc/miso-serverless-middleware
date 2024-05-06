import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { getConfig } from './config/middleware-config.js';
import { ControllersModule } from './controllers/controllers.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfig],
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true,
    }),
    ControllersModule,
    EventEmitterModule.forRoot(),
    PrometheusModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
