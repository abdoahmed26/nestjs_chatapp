import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { ConversationMember, ConversationMemberRole } from 'src/conversation-members/entities/conversation-member.entity';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private readonly conversationMemberRepository: Repository<ConversationMember>,
  ) {}
  async create(data: CreateConversationDto, userId: string, image: string | undefined) {
    const conversation = this.conversationRepository.create({
      ...data,
      image: image,
      creator: { id: userId },
    });
    await this.conversationRepository.save(conversation);
    const conversationMember = this.conversationMemberRepository.create({
      conversation: { id: conversation.id },
      user: { id: userId },
      role: ConversationMemberRole.ADMIN,
    });
    await this.conversationMemberRepository.save(conversationMember);
    return {status:"success", message: 'Conversation created successfully', conversation};
  }

  async findAll(userId:string) {
    console.log("Finding conversations for user:", userId);
    const conversations = await this.conversationMemberRepository.find({
      where:{
        userId
      },
      relations: ['conversation'],
    });
    return {status:"success", conversations};
  }

  async findOne(id: string) {
    const conversation = await this.conversationRepository.findOne({
      where:{id}
    })
    if(!conversation){
      throw new NotFoundException({status:"not found", message:"Conversation not found"});
    }
    return {status:"success", conversation};
  }

  async update(id: string, data: UpdateConversationDto, image: string | undefined) {
    const conversation = await this.conversationRepository.findOne({
      where:{id}
    })
    if(!conversation){
      throw new NotFoundException({status:"not found", message:"Conversation not found"});
    }
    const imageToUpdate = image ? image : conversation.image;
    await this.conversationRepository.update(id, {...data, image: imageToUpdate});
    return {status:"success", message: 'Conversation updated successfully'};
  }

  async remove(id: string) {
    const conversation = await this.conversationRepository.findOne({
      where:{id}
    })
    if(!conversation){
      throw new NotFoundException({status:"not found", message:"Conversation not found"});
    }
    await this.conversationRepository.delete(id);
    return {status:"success", message: 'Conversation removed successfully'};
  }
}
