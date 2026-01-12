import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MessageMentionsService } from './message-mentions.service';
import { CreateMessageMentionDto } from './dto/create-message-mention.dto';
import { UpdateMessageMentionDto } from './dto/update-message-mention.dto';

@Controller('message-mentions')
export class MessageMentionsController {
  constructor(private readonly messageMentionsService: MessageMentionsService) {}

  @Post()
  create(@Body() createMessageMentionDto: CreateMessageMentionDto) {
    return this.messageMentionsService.create(createMessageMentionDto);
  }

  @Get()
  findAll() {
    return this.messageMentionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageMentionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageMentionDto: UpdateMessageMentionDto) {
    return this.messageMentionsService.update(+id, updateMessageMentionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageMentionsService.remove(+id);
  }
}
