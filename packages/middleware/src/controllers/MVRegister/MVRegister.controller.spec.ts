import { Test, TestingModule } from '@nestjs/testing';
import { MVRegisterController } from './MVRegister.controller.js';

describe('MVRegisterController', () => {
  let controller: MVRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MVRegisterController],
    }).compile();

    controller = module.get<MVRegisterController>(MVRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
