import { Conversation } from "../../conversations/entities/conversation.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


export enum ConversationMemberRole {
    ADMIN = "admin",
    MEMBER = "member",
}
@Entity("conversation_members")
export class ConversationMember {
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({ type: "enum", enum: ConversationMemberRole })
    role:ConversationMemberRole;
    @CreateDateColumn({ type:"timestamp"})
    createdAt:Date;
    @UpdateDateColumn({ type:"timestamp"})
    updatedAt:Date;

    @Column({ type: "uuid" })
    userId:string;

    @ManyToOne(() => User, user => user.conversationsMember, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user:User;

    @ManyToOne(() => Conversation, conversation => conversation.members, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "conversationId" })
    conversation:Conversation;
}
