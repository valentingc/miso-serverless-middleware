import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../../controllers.module.js';
import { EWFlagController } from './EWFlag.controller.js';
import { EWFlagService } from './EWFlag.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [EWFlagController],
  providers: [EWFlagService],
  exports: [EWFlagService],
})
export class EWFlagModule {}
