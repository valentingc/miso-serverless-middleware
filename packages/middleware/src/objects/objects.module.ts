import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller.js';
import { ObjectsService } from './objects.service.js';

@Module({
  providers: [ObjectsService],
  controllers: [DemoController],
  exports: [ObjectsService],
})
export class ObjectsModule {}
