import { Message } from "../../messages/entities/message.entity";
import { User } from "../../users/entities/user.entity";
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("message_mentions")
export class MessageMention {
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @CreateDateColumn({ type:"timestamp"})
    createdAt:Date;
    @UpdateDateColumn({ type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => Message, message => message.mentions, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "messageId" })
    message:Message;

    @ManyToOne(() => User, user => user.messagesMention, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user:User;
}
