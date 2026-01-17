import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { Conversation } from './entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMember } from 'src/conversation-members/entities/conversation-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ConversationMember])],
  controllers: [ConversationsController],
  providers: [ConversationsService],
})
export class ConversationsModule {}
