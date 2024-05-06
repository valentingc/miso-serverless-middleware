import { Test, TestingModule } from '@nestjs/testing';
import { StatefulObjectController } from './stateful-object.controller.js';

describe('StatefulObjectController', () => {
  let controller: StatefulObjectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatefulObjectController],
    }).compile();

    controller = module.get<StatefulObjectController>(StatefulObjectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
