import { Test, TestingModule } from '@nestjs/testing';
import { PNCounterController } from './PNCounter.controller.js';

describe('PncounterController', () => {
  let controller: PNCounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PNCounterController],
    }).compile();

    controller = module.get<PNCounterController>(PNCounterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
