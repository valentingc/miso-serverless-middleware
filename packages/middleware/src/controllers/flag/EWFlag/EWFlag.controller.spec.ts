import { Test, TestingModule } from '@nestjs/testing';
import { EWFlagController } from './EWFlag.controller.js';

describe('EwflagController', () => {
  let controller: EWFlagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EWFlagController],
    }).compile();

    controller = module.get<EWFlagController>(EWFlagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
