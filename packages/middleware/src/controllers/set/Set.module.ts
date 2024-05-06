import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers.module.js';
import { SetController } from './Set.controller.js';
import { SetService } from './Set.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [SetController],
  providers: [SetService],
  exports: [SetService],
})
export class SetModule {}
