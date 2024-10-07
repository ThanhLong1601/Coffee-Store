import { IsString, Length, Matches } from 'class-validator';

export class VerifyOtpDTO {
  @IsString()
  @Length(4, 4, { message: 'OTP chỉ được nhập 4 số.' }) 
  @Matches(/^[0-9]+$/, { message: 'OTP chỉ được nhập số' }) 
  otp!: string;
}