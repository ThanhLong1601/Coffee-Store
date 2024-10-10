import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { OrderItem } from "./OrderItemEntity";

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

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems!: OrderItem[];
}