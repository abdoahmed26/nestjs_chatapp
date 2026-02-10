import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "src/conversations/entities/conversation.entity";
import { ChatGateway } from "./chat.gateway";


@Module({
    imports: [TypeOrmModule.forFeature([Conversation])],
    controllers: [],
    providers: [ChatGateway],
    exports: [ChatGateway],
})
export class ChatModule {}