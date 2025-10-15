import { Test, TestingModule } from '@nestjs/testing';
import { OpenbookService } from './openbook.service';

describe('OpenbookService', () => {
  let service: OpenbookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenbookService],
    }).compile();

    service = module.get<OpenbookService>(OpenbookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
