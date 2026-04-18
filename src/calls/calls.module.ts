import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Call } from "./entities/call.entity";
import { CallsService } from "./calls.service";
import { CallsController } from "./calls.controller";
import { CallGateway } from "./call.gateway";
import { User } from "src/users/entities/user.entity";
import { Conversation } from "src/conversations/entities/conversation.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Call, User, Conversation])],
  controllers: [CallsController],
  providers: [CallsService, CallGateway],
  exports: [CallsService],
})
export class CallsModule {}
