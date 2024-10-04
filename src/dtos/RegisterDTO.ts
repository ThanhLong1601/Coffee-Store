import { 
  IsNotEmpty, 
  IsEmail, 
  Length, 
  Matches, 
  MaxLength, 
  IsString 
} from 'class-validator';

export class RegisterDTO {
  
  @IsNotEmpty({ message: 'Name không được để trống' })
  @IsString({ message: 'Name phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Name không được vượt quá 50 ký tự' })
  @Matches(/^[A-Za-z\s]+$/, { message: 'Name không được chứa số' })
  name!: string;

  @IsNotEmpty({ message: 'Phone không được để trống' })
  @Matches(/^\d{11}$/, { message: 'Phone phải gồm đúng 11 chữ số' })
  phone!: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email phải có định dạng hợp lệ' })
  email!: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @Length(4, 10, { message: 'Password phải có độ dài từ 4 đến 10 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { 
    message: 'Password phải chứa ít nhất một chữ thường, một chữ hoa và một số' 
  })
  password!: string;

}