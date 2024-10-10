import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { OrderItem } from "./OrderItemEntity";
import { User } from "./UserEntity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({default: 1})
  quantity!: number;
  
  @Column()
  ristretto!: number;

  @Column({default: false})
  use_to!: boolean;

  @Column()
  size!: number;

  @Column()
  total_amount!: number;

  @Column({default: false})
  time_prepare!: boolean;

  @ManyToOne(() => User, user => user.orders)
  user!: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}