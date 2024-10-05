import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, IsEmail, Length, Matches, MaxLength, IsString } from "class-validator";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  @IsNotEmpty({message: 'Name không được để trống'})
  @IsString({message: 'Name phải là một chuỗi ký tự'})
  @MaxLength(50, {message: 'Name không được vượt quá 50 ký tự'})
  @Matches(/^[A-Za-z\s]+$/, {message: 'Name không được chứa số'})
  name!: string;

  @Column()
  @IsNotEmpty({message: 'Phone không được để trống'})
  @Matches(/^\+?\d{10,15}$/, { message: 'Phone phải bắt đầu bằng dấu + (nếu có) và có từ 10 đến 15 số' })
  phone!: string;

  @Column({unique: true})
  @IsNotEmpty({message: 'Email không được để trống'})
  @IsEmail({},{message: 'Email phải đúng định dạng hợp lệ'})
  email!: string; 

  @Column({unique: true})
  @IsNotEmpty({ message: 'Password không được để trống' })
  @Length(4, 10, { message: 'Password phải có độ dài từ 4 đến 10 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { 
    message: 'Password phải chứa ít nhất một chữ thường, một chữ hoa và một số' 
  })
  password!: string;
}