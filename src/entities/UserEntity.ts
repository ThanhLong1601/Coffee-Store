import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Otp } from "./OtpEntity";
import { Order } from "./OrderEntity";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({unique: true})
  phone: string;

  @Column({unique: true})
  email: string; 

  @Column()
  password: string;

  @OneToMany(() => Otp, otp => otp.user)
  otps: Otp[]

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @CreateDateColumn({type: 'timestamp'})
  created_at: Date;

  @UpdateDateColumn({type: 'timestamp'})
  updated_at: Date;

}