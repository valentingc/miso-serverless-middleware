import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers.module.js';
import { GCounterController } from './GCounter.controller.js';
import { GCounterService } from './GCounter.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [GCounterController],
  providers: [GCounterService],
  exports: [GCounterService],
})
export class GCounterModule {}
