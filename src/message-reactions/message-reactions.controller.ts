/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Post, Body, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { MessageReactionsService } from './message-reactions.service';
import { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import type { Request } from 'express';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller(`${process.env.API_VERSION}/message-reactions`)
@UseGuards(AuthGuard)
export class MessageReactionsController {
  constructor(private readonly messageReactionsService: MessageReactionsService) {}

  @Post()
  create(@Body() data: CreateMessageReactionDto,@Req() req: Request) {
    const userId = (req as any).user.id;
    return this.messageReactionsService.create(data, userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageReactionsService.remove(id);
  }
}
