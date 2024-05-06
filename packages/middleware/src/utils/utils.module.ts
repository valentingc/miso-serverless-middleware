import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers/controllers.module.js';
import { CrdtUtilsService } from './crdt-utils.service.js';
import { SetUtilsService } from './set-utils.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  providers: [SetUtilsService, CrdtUtilsService],
  exports: [SetUtilsService, CrdtUtilsService],
})
export class UtilsModule {}
