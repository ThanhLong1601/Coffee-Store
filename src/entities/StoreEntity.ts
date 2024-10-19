import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Order } from "./OrderEntity";
import { Product } from "./ProductEntity";

type Location = {
  latitude: number;
  longitude: number;
};
@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: "json", nullable: true})
  location: Location;

  @OneToMany(() => Order, order => order.store)
  orders: Order[];

  @OneToMany(() => Product, product => product.store)
  products: Product[];
}