import { IsEnum, IsInt, IsOptional } from "class-validator";
import { CallStatus } from "../entities/call.entity";

export class UpdateCallDto {
  @IsOptional()
  @IsEnum(CallStatus, { message: "status must be a valid call status" })
  status?: CallStatus;

  @IsOptional()
  @IsInt({ message: "duration must be an integer (seconds)" })
  duration?: number;
}
