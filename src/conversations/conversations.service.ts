import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { ConversationMember, ConversationMemberRole } from 'src/conversation-members/entities/conversation-member.entity';
import { pagination } from 'src/helpers/pagination';

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
    if (data.membersIds && data.membersIds.length > 0) {
      const membersToAdd = data.membersIds.map((memberId) => {
        return this.conversationMemberRepository.create({
          conversation: { id: conversation.id },
          user: { id: memberId },
          role: ConversationMemberRole.MEMBER,
        });
      });
      await this.conversationMemberRepository.save(membersToAdd);
    }
    return {status:"success", message: 'Conversation created successfully', conversation};
  }

  async findAll(userId:string, limit: number, page: number) {
    const [conversations, total] = await this.conversationRepository.findAndCount({
      where:{
        members:{
          user:{id:userId}
        }
      },
      skip: (page - 1) * limit,
      take: limit,
      order: {createdAt: "DESC"}
    });
    const pagin = pagination(limit, page, total);
    return {status:"success", conversations, pagination: pagin};
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
