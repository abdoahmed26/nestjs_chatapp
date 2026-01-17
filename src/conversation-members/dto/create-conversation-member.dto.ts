import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { ConversationMemberRole } from "../entities/conversation-member.entity";

export class CreateConversationMemberDto {
    @IsNotEmpty({ message: "userId is required" })
    @IsUUID("4", { message: "userId must be a valid UUID" })
    userId: string;
    @IsNotEmpty({ message: "role is required" })
    @IsEnum(ConversationMemberRole, { message: `role must be one of the following values: admin, member` })
    role: ConversationMemberRole;
}
