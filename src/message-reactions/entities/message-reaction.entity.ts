import { Message } from "../../messages/entities/message.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity("message_reactions")
export class MessageReaction {
    @PrimaryGeneratedColumn("uuid")
    id:string;
    @Column({ type: "varchar", length: 255 })
    reaction:string;
    @CreateDateColumn({ type:"timestamp"})
    createdAt:Date;
    @UpdateDateColumn({ type:"timestamp"})
    updatedAt:Date;

    @ManyToOne(() => Message, (message) => message.reactions, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "messageId" })
    message:Message;

    @ManyToOne(() => User, (user) => user.messagesReaction, { onDelete: "CASCADE" , onUpdate: "CASCADE"})
    @JoinColumn({ name: "userId" })
    user:User;
}
