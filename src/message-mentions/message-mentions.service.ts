import { Injectable } from '@nestjs/common';
import { CreateMessageMentionDto } from './dto/create-message-mention.dto';
import { UpdateMessageMentionDto } from './dto/update-message-mention.dto';

@Injectable()
export class MessageMentionsService {
  create(createMessageMentionDto: CreateMessageMentionDto) {
    return 'This action adds a new messageMention';
  }

  findAll() {
    return `This action returns all messageMentions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} messageMention`;
  }

  update(id: number, updateMessageMentionDto: UpdateMessageMentionDto) {
    return `This action updates a #${id} messageMention`;
  }

  remove(id: number) {
    return `This action removes a #${id} messageMention`;
  }
}
