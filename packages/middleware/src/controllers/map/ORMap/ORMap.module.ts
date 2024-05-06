import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../../controllers.module.js';
import { ORMapController } from './ORMap.controller.js';
import { ORMapService } from './ORMap.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [ORMapController],
  providers: [ORMapService],
  exports: [ORMapService],
})
export class ORMapModule {}
