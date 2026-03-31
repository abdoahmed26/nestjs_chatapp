import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageReactionDto } from './dto/create-message-reaction.dto';
import { Repository } from 'typeorm';
import { MessageReaction } from './entities/message-reaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/messages/entities/message.entity';

@Injectable()
export class MessageReactionsService {

  constructor(
    @InjectRepository(MessageReaction) private readonly messageReactionRepository: Repository<MessageReaction>,
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>
  ) {}
  async create(data: CreateMessageReactionDto, userId: string) {
    const message = await this.messageRepository.findOne({ where: { id: data.messageId } });
    if (!message) {
      throw new NotFoundException({ status: "not found", message: "Message not found" });
    }
    const newMessageReaction = this.messageReactionRepository.create({ reaction: data.reaction, message: { id: data.messageId }, user: { id: userId } });
    await this.messageReactionRepository.save(newMessageReaction);
    return { status: "success", data: newMessageReaction };
  }

  async remove(id: string) {
    const messageReaction = await this.messageReactionRepository.findOne({ where: { id } });
    if (!messageReaction) {
      throw new NotFoundException({ status: "not found", message: "Message reaction not found" });
    }
    await this.messageReactionRepository.remove(messageReaction);
    return { status: "success", message: "Message reaction removed" };
  }
}
