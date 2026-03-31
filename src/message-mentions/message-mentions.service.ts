import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageMentionDto } from './dto/create-message-mention.dto';
import { Repository } from 'typeorm';
import { MessageMention } from './entities/message-mention.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessageMentionsService {
  constructor(
    @InjectRepository(MessageMention) private readonly messageMentionRepository: Repository<MessageMention>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async create(data: CreateMessageMentionDto) {
    const message = await this.messageRepository.findOne({ where: { id: data.messageId } });
    if (!message) {
      throw new NotFoundException({ status: "not found", message: "Message not found" });
    }
    const user = await this.userRepository.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new NotFoundException({ status: "not found", message: "User not found" });
    }
    const newMessageMention = this.messageMentionRepository.create({ message: { id: data.messageId }, user: { id: data.userId } });
    await this.messageMentionRepository.save(newMessageMention);
    return { status: "success", data: newMessageMention };
  }

  async remove(id: string) {
    const messageMention = await this.messageMentionRepository.findOne({ where: { id } });
    if (!messageMention) {
      throw new NotFoundException({ status: "not found", message: "Message mention not found" });
    }
    await this.messageMentionRepository.remove(messageMention);
    return { status: "success", message: "Message mention removed" };
  }
}
