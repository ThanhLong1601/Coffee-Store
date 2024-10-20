import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./OrderEntity";
import { Product } from "./ProductEntity";

enum OrderSize {
  SMALL = 250,
  MEDIUM = 350,
  LARGE = 450,
}

enum OrderRistretto {
  SMALL = 1,
  MEDIUM = 2,
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {onDelete: 'CASCADE'})
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {onDelete: 'CASCADE'})
  product: Product;

  @Column({default: 1})
  quantity: number;
  
  @Column({type: 'enum', enum:OrderRistretto, default: OrderRistretto.SMALL}) //Quantity shot(1 or 2) of coffee ristretto
  ristretto: OrderRistretto;

  @Column({default: false}) //Onsite or Takeaway
  isOnsite: boolean;

  @Column({type: 'enum', enum: OrderSize, default: OrderSize.MEDIUM})
  size: OrderSize;

  @Column({default: false})
  time_prepare: boolean;

  @Column({type: 'time', nullable: true})
  prepare_time: string | null;

}