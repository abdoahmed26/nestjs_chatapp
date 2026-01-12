import { MessageReaction } from "../../message-reactions/entities/message-reaction.entity";
import { Conversation } from "../../conversations/entities/conversation.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MessageMention } from "../../message-mentions/entities/message-mention.entity";


@Entity("messages")
export class Message {
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({ type: "text", nullable: true })
    content?:string;
    @Column({type: "simple-array", nullable: true })
    files?:string[];
    @Column({ type: "boolean", default: false })
    seen:boolean;
    @CreateDateColumn({ type:"timestamp"})
    createdAt:Date;
    @UpdateDateColumn({ type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => Message, message => message.replies, { onDelete: "SET NULL" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "parentMessageId" })
    parentMessage?:Message | null;

    @ManyToOne(() => Message, message => message.parentMessage)
    replies:Message[];

    @ManyToOne(() => User, user => user.messages, { onDelete: "SET NULL" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "senderId" })
    sender:User;

    @ManyToOne(() => Conversation, conversation => conversation.messages, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "conversationId" })
    conversation:Conversation;

    @OneToMany(() => MessageReaction, (messageReaction) => messageReaction.message)
    reactions: MessageReaction[];

    @OneToMany(() => MessageMention, (messageMention) => messageMention.message)
    mentions: MessageMention[];
}
