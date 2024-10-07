import { IsNotEmpty, IsEmail} from 'class-validator';

export class ForgotPasswordDTO {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email phải có định dạng hợp lệ' })
  email!: string;
}