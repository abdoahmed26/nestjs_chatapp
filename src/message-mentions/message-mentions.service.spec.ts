import { Test, TestingModule } from '@nestjs/testing';
import { MessageMentionsService } from './message-mentions.service';

describe('MessageMentionsService', () => {
  let service: MessageMentionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageMentionsService],
    }).compile();

    service = module.get<MessageMentionsService>(MessageMentionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
