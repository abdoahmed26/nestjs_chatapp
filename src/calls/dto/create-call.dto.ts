import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";
import { CallType } from "../entities/call.entity";

export class CreateCallDto {
  @IsNotEmpty({ message: "calleeId is required" })
  @IsUUID("4", { message: "calleeId must be a valid UUID" })
  calleeId: string;

  @IsNotEmpty({ message: "type is required" })
  @IsEnum(CallType, { message: "type must be audio or video" })
  type: CallType;

  @IsOptional()
  @IsUUID("4", { message: "conversationId must be a valid UUID" })
  conversationId?: string;
}
