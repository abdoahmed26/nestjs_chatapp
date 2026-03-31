import { Controller, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { MessageMentionsService } from './message-mentions.service';
import { CreateMessageMentionDto } from './dto/create-message-mention.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller(`${process.env.API_VERSION}/message-mentions`)
@UseGuards(AuthGuard)
export class MessageMentionsController {
  constructor(private readonly messageMentionsService: MessageMentionsService) {}

  @Post()
  create(@Body() createMessageMentionDto: CreateMessageMentionDto) {
    return this.messageMentionsService.create(createMessageMentionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageMentionsService.remove(id);
  }
}
