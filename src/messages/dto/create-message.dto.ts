import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateMessageDto {
    @IsOptional()
    @IsString({message:"content must be a string"})
    content?:string;
    @IsOptional()
    @IsUUID("4",{message:"parentMessageId must be a valid UUID"})
    parentMessageId?:string;
    @IsNotEmpty({message:"conversationId is required"})
    @IsUUID("4",{message:"conversationId must be a valid UUID"})
    conversationId:string;
}
