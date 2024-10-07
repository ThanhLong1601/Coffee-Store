import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class store {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string
}