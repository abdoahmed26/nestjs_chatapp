import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ConversationType } from "../entities/conversation.entity";

export class CreateConversationDto {
    @IsOptional()
    @IsString({ message: "title must be a string" })
    title?: string;
    @IsOptional()
    @IsString({ message: "description must be a string" })
    description?: string;
    @IsNotEmpty({ message: "type is required" })
    @IsEnum(["private", "group", "channel"], { message: "type must be one of the following values: private, group, channel" })
    type: ConversationType;
}
