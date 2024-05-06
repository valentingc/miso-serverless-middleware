import { Module, forwardRef } from '@nestjs/common';
import { ControllersModule } from '../controllers.module.js';
import { MVRegisterController } from './MVRegister.controller.js';
import { MVRegisterService } from './MVRegister.service.js';

@Module({
  imports: [forwardRef(() => ControllersModule)],
  controllers: [MVRegisterController],
  providers: [MVRegisterService],
  exports: [MVRegisterService],
})
export class MVRegisterModule {}
