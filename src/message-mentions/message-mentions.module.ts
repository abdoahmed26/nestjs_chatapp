import { Module } from '@nestjs/common';
import { MessageMentionsService } from './message-mentions.service';
import { MessageMentionsController } from './message-mentions.controller';

@Module({
  controllers: [MessageMentionsController],
  providers: [MessageMentionsService],
})
export class MessageMentionsModule {}
