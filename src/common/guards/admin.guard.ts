/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { ConversationMember, ConversationMemberRole } from "src/conversation-members/entities/conversation-member.entity";
import { Repository } from "typeorm";


@Injectable()
export class AdminGuard implements CanActivate {
    constructor(
        @InjectRepository(ConversationMember)
        private readonly conversationMemberRepository: Repository<ConversationMember>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const conversationId = request.params.id;
        const userId = (request as any).user.id;
        const isAdmin = await this.conversationMemberRepository.findOne({
            where:{
                conversation:{id:conversationId},
                user:{id:userId},
                role:ConversationMemberRole.ADMIN
            }
        });
        if(!isAdmin){
            throw new ForbiddenException({status:"forbidden",message:"you don't have permission to access this route"});
        }
        return true;
    }
}