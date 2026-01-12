import { Module } from '@nestjs/common';
import { MessageReactionsService } from './message-reactions.service';
import { MessageReactionsController } from './message-reactions.controller';

@Module({
  controllers: [MessageReactionsController],
  providers: [MessageReactionsService],
})
export class MessageReactionsModule {}
