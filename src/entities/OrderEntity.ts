import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { OrderItem } from "./OrderItemEntity";
import { User } from "./UserEntity";
import { Store } from "./StoreEntity";


export enum OrderStatus {
  INIT = 'Init',
  PENDING = 'Pending',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @ManyToOne(() => Store, store => store.orders)
  store: Store;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {cascade: true})
  orderItems: OrderItem[];

  @Column()
  shipping_address: string

  @Column({type: 'decimal', precision: 5, scale: 2, default: 0})
  discount: number; // Trường này lưu theo phần trăm từ 0.00% đến 100.00%

  @Column({type: 'int'})
  total_price: number;  // Dữ liệu tiền dollar nên trường này lưu theo cents để chuyển sang dollar

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date; 

  @Column({type: 'enum', enum: OrderStatus, default: OrderStatus.INIT})
  status: OrderStatus;
  
}