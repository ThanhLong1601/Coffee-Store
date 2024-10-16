import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Otp } from "./OtpEntity";
import { Order } from "./OrderEntity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({unique: true})
  email: string; 

  @Column({unique: true})
  password: string;

  @OneToMany(() => Otp, otp => otp.user)
  otps: Otp[]

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}