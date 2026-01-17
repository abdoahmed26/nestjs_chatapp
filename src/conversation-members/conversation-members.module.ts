import { Module } from '@nestjs/common';
import { ConversationMembersService } from './conversation-members.service';
import { ConversationMembersController } from './conversation-members.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMember } from './entities/conversation-member.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationMember, Conversation, User])
  ],
  controllers: [ConversationMembersController],
  providers: [ConversationMembersService],
})
export class ConversationMembersModule {}
