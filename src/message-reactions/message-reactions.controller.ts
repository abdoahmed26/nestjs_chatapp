import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageReactionsService } from './message-reactions.service';
import { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import { UpdateMessageReactionDto } from './dto/update-message-reaction.dto';

@Controller('message-reactions')
export class MessageReactionsController {
  constructor(private readonly messageReactionsService: MessageReactionsService) {}

  @Post()
  create(@Body() createMessageReactionDto: CreateMessageReactionDto) {
    return this.messageReactionsService.create(createMessageReactionDto);
  }

  @Get()
  findAll() {
    return this.messageReactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageReactionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageReactionDto: UpdateMessageReactionDto) {
    return this.messageReactionsService.update(+id, updateMessageReactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageReactionsService.remove(+id);
  }
}
