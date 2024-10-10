import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./OrderEntity";
import { Product } from "./ProductEntity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Order, (order) => order.orderItems, {onDelete: 'CASCADE'})
  order!: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {onDelete: 'CASCADE'})
  product!: Product;

  @Column()
  total_price!: number;

}