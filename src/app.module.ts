import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from './config/db';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ConversationMembersModule } from './conversation-members/conversation-members.module';
import { MessagesModule } from './messages/messages.module';
import { MessageMentionsModule } from './message-mentions/message-mentions.module';
import { MessageReactionsModule } from './message-reactions/message-reactions.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(dbConfig.options),
    UsersModule,
    AuthModule,
    ConversationsModule,
    ConversationMembersModule,
    MessagesModule,
    MessageMentionsModule,
    MessageReactionsModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
