import { Test, TestingModule } from '@nestjs/testing';
import { MessageMentionsController } from './message-mentions.controller';
import { MessageMentionsService } from './message-mentions.service';

describe('MessageMentionsController', () => {
  let controller: MessageMentionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageMentionsController],
      providers: [MessageMentionsService],
    }).compile();

    controller = module.get<MessageMentionsController>(MessageMentionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
