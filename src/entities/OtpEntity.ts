import { Entity, PrimaryGeneratedColumn, Column, Timestamp, Index, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./UserEntity";

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  otp_code!: string;

  @CreateDateColumn({type: 'timestamp'})
  created_at!: Date;

  @Column({type: 'timestamp'})
  expires_at!: Date;

  @Column({default: 0})
  attempts!: number;

  @Column({default: false})
  isUsed!: boolean;

  @ManyToOne(() => User, user => user.otps, {onDelete: 'CASCADE'})
  user!: User;
}