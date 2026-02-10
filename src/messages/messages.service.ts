import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    @InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,
    private readonly chat: ChatGateway,
  ) {}
  async create(userId:string,data: CreateMessageDto, files?: string[]) {
    const conversation = await this.conversationRepository.findOne({ where: { id: data.conversationId } });
    if (!conversation) {
      throw new NotFoundException({ status: "not found", message: "Conversation not found" });
    }
    const newMessage = this.messageRepository.create({
      content: data.content,
      conversation: { id: data.conversationId },
      parentMessage: data.parentMessageId ? { id: data.parentMessageId } : null,
      files: files,
      sender: { id: userId },
    });
    await this.messageRepository.save(newMessage);
    this.chat.emitTo(data.conversationId, 'message', newMessage);
    return { status: "success", data: newMessage };
  }

  async findAll(id:string) {
    const conversation = await this.conversationRepository.findOne({ where: { id } });
    if (!conversation) {
      throw new NotFoundException({ status: "not found", message: "Conversation not found" });
    }
    const messages = await this.messageRepository.find({ where: { conversation: { id } }, relations: ['sender', 'parentMessage', 'reactions', 'mentions'] });
    return { status: "success", data: messages };

  }

  async findOne(id: string) {
    const message = await this.messageRepository.findOne({ where: { id }, relations: ['sender', 'parentMessage', 'reactions', 'mentions'] });
    if (!message) {
      throw new NotFoundException({ status: "not found", message: "Message not found" });
    }
    return { status: "success", data: message };
  }

  async update(id: string, data: UpdateMessageDto, files?: string[]) {
    const message = await this.messageRepository.findOne({ where: { id }, relations: ['conversation'] });
    if (!message) {
      throw new NotFoundException({ status: "not found", message: "Message not found" });
    }
    await this.messageRepository.update(id, { ...data, files: files ? files : message.files });
    const updatedMessage = await this.messageRepository.findOne({ where: { id }, relations: ['sender', 'parentMessage', 'reactions', 'mentions'] });
    this.chat.emitTo(message.conversation.id, 'messageUpdated', updatedMessage);
    return { status: "success", data: updatedMessage };
  }

  async remove(id: string) {
    const message = await this.messageRepository.findOne({ where: { id }, relations: ['conversation'] });
    if (!message) {
      throw new NotFoundException({ status: "not found", message: "Message not found" });
    }
    await this.messageRepository.delete(id);
    this.chat.emitTo(message.conversation.id, 'messageDeleted', { id });
    return { status: "success", data: { id } };
  }
}
