import { Module } from '@nestjs/common';
import { MessageMentionsService } from './message-mentions.service';
import { MessageMentionsController } from './message-mentions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Message } from 'src/messages/entities/message.entity';
import { MessageMention } from './entities/message-mention.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageMention, Message, User])],
  controllers: [MessageMentionsController],
  providers: [MessageMentionsService],
})
export class MessageMentionsModule {}
