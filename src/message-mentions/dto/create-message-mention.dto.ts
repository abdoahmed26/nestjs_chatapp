import { IsNotEmpty, IsUUID } from "class-validator";

export class CreateMessageMentionDto {
    @IsNotEmpty({ message: "messageId is required" })
    @IsUUID("4", { message: "messageId must be a UUID" })
    messageId: string;

    @IsNotEmpty({ message: "userId is required" })
    @IsUUID("4", { message: "userId must be a UUID" })
    userId: string;
}
