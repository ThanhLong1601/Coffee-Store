import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./UserEntity";

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  otp_code: string;

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;

  @Column({type: 'datetime'})
  expires_at: Date;

  @Column({default: 0})
  attempts: number;

  @Column({default: false})
  isUsed: boolean;

  @ManyToOne(() => User, user => user.otps, {onDelete: 'CASCADE'})
  user: User;
}