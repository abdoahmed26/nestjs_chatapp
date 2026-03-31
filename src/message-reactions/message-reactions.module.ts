import { Module } from '@nestjs/common';
import { MessageReactionsService } from './message-reactions.service';
import { MessageReactionsController } from './message-reactions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageReaction, Message])],
  controllers: [MessageReactionsController],
  providers: [MessageReactionsService],
})
export class MessageReactionsModule {}
