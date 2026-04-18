import { User } from "../../users/entities/user.entity";
import { Conversation } from "../../conversations/entities/conversation.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum CallType {
  AUDIO = "audio",
  VIDEO = "video",
}

export enum CallStatus {
  RINGING = "ringing",
  ONGOING = "ongoing",
  ENDED = "ended",
  MISSED = "missed",
  REJECTED = "rejected",
}

@Entity("calls")
export class Call {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: CallType })
  type: CallType;

  @Column({ type: "enum", enum: CallStatus, default: CallStatus.RINGING })
  status: CallStatus;

  @Column({ type: "timestamptz", nullable: true })
  startedAt?: Date;

  @Column({ type: "timestamptz", nullable: true })
  endedAt?: Date;

  @Column({ type: "int", nullable: true })
  duration?: number; // seconds

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.callerCalls, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "callerId" })
  caller: User;

  @ManyToOne(() => User, (user) => user.calleeCalls, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "calleeId" })
  callee: User;

  @ManyToOne(() => Conversation, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "conversationId" })
  conversation?: Conversation;
}
