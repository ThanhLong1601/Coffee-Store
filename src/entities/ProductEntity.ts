import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { OrderItem } from "./OrderItemEntity";
import { Store } from "./StoreEntity";

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;
  
  @Column()
  name: string;

  @Column({type: 'int'})
  price: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
  
  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

}