import { IsNotEmpty, IsString } from "class-validator";

export class CreateMessageReactionDto {
    @IsNotEmpty({ message: "reaction is required" })
    @IsString({ message: "reaction must be a string" })
    reaction:string;
    @IsNotEmpty({ message: "messageId is required" })
    @IsString({ message: "messageId must be a string" })
    messageId: string;
}
