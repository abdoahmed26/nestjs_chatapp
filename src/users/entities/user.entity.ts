import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
