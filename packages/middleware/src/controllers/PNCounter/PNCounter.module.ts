import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers.module.js';
import { PNCounterController } from './PNCounter.controller.js';
import { PNCounterService } from './PNCounter.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [PNCounterController],
  providers: [PNCounterService],
  exports: [PNCounterService],
})
export class PNCounterModule {}
