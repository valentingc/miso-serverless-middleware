import { Test, TestingModule } from '@nestjs/testing';
import { GCounterController } from './GCounter.controller.js';

describe('GcounterController', () => {
  let controller: GCounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GCounterController],
    }).compile();

    controller = module.get<GCounterController>(GCounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
