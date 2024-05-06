import { Test, TestingModule } from '@nestjs/testing';
import { SetUtilsService } from './set-utils.service.js';

describe('UtilsService', () => {
  let service: SetUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetUtilsService],
    }).compile();

    service = module.get<SetUtilsService>(SetUtilsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
