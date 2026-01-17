import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationMemberDto } from './dto/create-conversation-member.dto';
import { UpdateConversationMemberDto } from './dto/update-conversation-member.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationMember } from './entities/conversation-member.entity';
import { Repository } from 'typeorm';
import { Conversation } from 'src/conversations/entities/conversation.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ConversationMembersService {

  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(ConversationMember)
    private readonly conversationMemberRepository: Repository<ConversationMember>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(conversationId: string, data: CreateConversationMemberDto) {
    const user = await this.userRepository.findOne({ where: { id: data.userId } });
    if (!user) {
      throw new NotFoundException({ status: "not found", message: "User not found" });
    }
    const conversation = await this.conversationRepository.findOne({ where: { id: conversationId } });
    if (!conversation) {
      throw new NotFoundException({ status: "not found", message: "Conversation not found" });
    }
    const existingMember = await this.conversationMemberRepository.findOne({
      where: {
        user: { id: data.userId },
        conversation: { id: conversationId },
      },
    });
    if (existingMember) {
      throw new BadRequestException({ status: "bad request", message: "User is already a member of the conversation" });
    }
    const newConversationMember = this.conversationMemberRepository.create({
      role: data.role,
      user: { id: data.userId },
      conversation: { id: conversationId },
    });
    await this.conversationMemberRepository.save(newConversationMember);
    return { status: "success", conversationMember: newConversationMember };
  }

  async findAll(id: string) {
    const conversationMembers = await this.conversationMemberRepository.find({
      where: {
        conversation: { id },
      },
      relations: ['user'],
    })
    return { status: "success", conversationMembers };
  }

  async update(id: string, data: UpdateConversationMemberDto) {
    const conversationMember = await this.conversationMemberRepository.findOne({ where: { id } });
    if (!conversationMember) {
      throw new NotFoundException({ status: "not found", message: "Conversation member not found" });
    }
    await this.conversationMemberRepository.update(id, data);
    return { status: "success", message: `member updated successfully` };
  }

  async remove(id: string) {
    const conversationMember = await this.conversationMemberRepository.findOne({ where: { id } });
    if (!conversationMember) {
      throw new NotFoundException({ status: "not found", message: "Conversation member not found" });
    }
    await this.conversationMemberRepository.delete(id);
    return { status: "success", message: `member removed successfully` };
  }
}
