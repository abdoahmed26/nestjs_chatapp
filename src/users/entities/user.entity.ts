import { Message } from "../../messages/entities/message.entity";
import { ConversationMember } from "../../conversation-members/entities/conversation-member.entity";
import { Conversation } from "../../conversations/entities/conversation.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageReaction } from "../../message-reactions/entities/message-reaction.entity";
import { MessageMention } from "../../message-mentions/entities/message-mention.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({length: 20})
    name: string;

    @Column({unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable: true})
    profileImage?: string;

    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date;
    @UpdateDateColumn({type: 'timestamp'})
    updatedAt: Date;

    @OneToMany(() => Conversation, conversation => conversation.creator)
    conversations: Conversation[];

    @OneToMany(() => ConversationMember, conversationMember => conversationMember.user)
    conversationsMember: ConversationMember[]

    @OneToMany(() => Message, message => message.sender)
    messages: Message[];

    @OneToMany(() => MessageReaction, (messageReaction) => messageReaction.user)
    messagesReaction: MessageReaction[];

    @OneToMany(() => MessageMention, (messageMention) => messageMention.user)
    messagesMention: MessageMention[];
}
