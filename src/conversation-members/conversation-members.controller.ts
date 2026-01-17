import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ConversationMembersService } from './conversation-members.service';
import { CreateConversationMemberDto } from './dto/create-conversation-member.dto';
import { UpdateConversationMemberDto } from './dto/update-conversation-member.dto';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('api/v1/conversation-members')
@UseGuards(AuthGuard)
export class ConversationMembersController {
  constructor(private readonly conversationMembersService: ConversationMembersService) {}

  @Post(":id")  // :id is conversation id
  @UseGuards(AdminGuard)
  create(@Param('id') id: string, @Body() data: CreateConversationMemberDto) {
    return this.conversationMembersService.create(id, data);
  }

  @Get(":id")  // :id is conversation id
  findAll(@Param('id') id: string) {
    return this.conversationMembersService.findAll(id);
  }

  @Patch(':id')  // :id is conversation id
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() data: UpdateConversationMemberDto, @Query('memberId') memberId: string) {
    return this.conversationMembersService.update(memberId, data);
  }

  @Delete(':id')  // :id is conversation id
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string, @Query('memberId') memberId: string) {
    return this.conversationMembersService.remove(memberId);
  }
}
