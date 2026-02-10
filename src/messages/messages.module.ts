import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message, Conversation]), ChatModule],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
