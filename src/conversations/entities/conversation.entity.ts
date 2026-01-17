import { Message } from "../../messages/entities/message.entity";
import { ConversationMember } from "../../conversation-members/entities/conversation-member.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ConversationType {
    PRIVATE = "private",
    GROUP = "group",
    CHANNEL = "channel"
}
@Entity("conversations")
export class Conversation {
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({ type: "varchar", length: 255, nullable: true })
    title?:string;
    @Column({ type: "text", nullable: true })
    description?:string;
    @Column({ type: "varchar", length: 255, nullable: true })
    image?:string;
    @Column({ type: "enum", enum: ConversationType })
    type:ConversationType;
    @CreateDateColumn({ type:"timestamp"})
    createdAt:Date;
    @UpdateDateColumn({ type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => User, user => user.conversations, { onDelete: "SET NULL" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "creatorId" })
    creator:User;

    @OneToMany(() => ConversationMember, conversationMember => conversationMember.conversation)
    members:ConversationMember[];

    @OneToMany(() => Message, message => message.conversation)
    messages:Message[]
}
