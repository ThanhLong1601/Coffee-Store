import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, IsEmail, Length, Matches, MaxLength, IsString } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({unique: true})
  email!: string; 

  @Column({unique: true})
  password!: string;
}