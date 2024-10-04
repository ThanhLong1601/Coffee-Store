import { 
  IsNotEmpty, 
  IsEmail, 
  Length, 
  Matches 
} from 'class-validator';

export class LoginDTO {

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