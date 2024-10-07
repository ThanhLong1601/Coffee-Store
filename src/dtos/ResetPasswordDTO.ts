import { 
  IsNotEmpty, 
  Length, 
  Matches, 
  IsString, 
  Equals 
} from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @IsString({ message: 'Mật khẩu mới phải là chuỗi ký tự' })
  @Length(4, 10, { message: 'Password phải có độ dài từ 4 đến 10 ký tự' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, { 
    message: 'Password phải chứa ít nhất một chữ thường, một chữ hoa và một số' 
  })
  newPassword!: string;

  @IsNotEmpty({ message: 'Xác nhận mật khẩu không được để trống' })
  confirmPassword!: string;
}