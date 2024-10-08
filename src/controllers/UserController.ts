import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { User } from '../entities/UserEntity';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Otp } from '../entities/OtpEntity';
import { ForgotPasswordDTO } from '../dtos/ForgotPasswordDTO';
import { sendOtpEmail } from '../services/emailService';
import { ResetPasswordDTO } from '../dtos/ResetPasswordDTO';
import { VerifyOtpDTO } from '../dtos/VerifyOtpDTO';
import { AuthRequest } from '../middlewares/authMiddleware';

export class UserController {
  
  static async register(req: Request, res: Response): Promise<void> {
      const userRepository = AppDataSource.getRepository(User);
      const { name, phone, email, password } = req.body as RegisterDTO;

      try {
        const existingUserByEmail = await userRepository.findOne({ where: { email } });
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email đã được sử dụng.' });
            return;
        }

        const existingUsers = await userRepository.find();
        for (const user of existingUsers) {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                res.status(400).json({ message: 'Mật khẩu đã tồn tại. Vui lòng chọn mật khẩu khác.' });
                return;
            }
        }

          const hashedPassword = await bcrypt.hash(password, 10);
          const user = userRepository.create({
              name,
              phone,
              email,
              password: hashedPassword,
          });

          await userRepository.save(user);
          res.status(201).json({ message: 'Đăng ký thành công!' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Lỗi máy chủ.' });
      }
  }

  static async login(req: Request, res: Response): Promise<void> {
      const userRepository = AppDataSource.getRepository(User);
      const { email, password } = req.body as LoginDTO;

      try {
          const user = await userRepository.findOne({ where: { email } });

          if (!user) {
              res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
              return; 
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
              res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác.' });
              return;
          }

          const token = jwt.sign(
              { userId: user.id, email: user.email },
              process.env.JWT_SECRET!,
              { expiresIn: '1h' } // Phần này nên làm thế nào mới an toàn ???
          );

          res.status(200).json({ message: 'Đăng nhập thành công!', token, user: user.name });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Lỗi máy chủ.' });
      }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(Otp);
    const { email } = req.body as ForgotPasswordDTO;

    try {
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
        return;
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      const otp = otpRepository.create({
        otp_code: otpCode,
        user: user,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), 
      });

      await otpRepository.save(otp);

      await sendOtpEmail(email, otpCode);

      res.status(200).json({ message: 'Mã OTP đã được gửi về email của bạn.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  }

  static async verifyOtp(req: Request, res: Response): Promise<void> {
    const otpRepository = AppDataSource.getRepository(Otp);
    const { otp } = req.body as VerifyOtpDTO;

    try {
      const otpRecord = await otpRepository.findOne({
        where: {
          otp_code: otp,
          Isused: false,
        },
        relations: ['user'],
        order: { created_at: 'DESC' },
      });

      if (!otpRecord) {
        res.status(400).json({ message: 'OTP không hợp lệ.' });
        return;
      }

      const currentTime = new Date();
      if (currentTime > otpRecord.expires_at) {
        res.status(400).json({ message: 'OTP đã hết hạn.' });
        return;
      }

      if (otpRecord.otp_code !== otp) {
        otpRecord.attempts += 1;
        await otpRepository.save(otpRecord);

        if (otpRecord.attempts >= 3) {

          await otpRepository.delete(otpRecord.id);
          res.status(400).json({ message: 'Bạn đã nhập sai OTP quá 3 lần. Mã OTP đã bị hủy' });
        } else {
          res.status(400).json({ message: 'OTP không chính xác. Thử lại.' });
        }
        return;
      }

      otpRecord.Isused = true;
      await otpRepository.save(otpRecord);

      const resetToken = jwt.sign(
        {userId: otpRecord.user.id, email: otpRecord.user.email, otpId: otpRecord.id},
        process.env.JWT_SECRET!,
        {expiresIn: '5m'}
      );

      res.status(200).json({ message: 'OTP đã được xác thực thành công.', resetToken });
    } catch (error) {
      console.error(error);
    }
  }

  static async resetPassword(req: AuthRequest, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const { newPassword, confirmPassword } = req.body as ResetPasswordDTO;

    if (!req.user || !req.user.email) {
      res.status(400).json({ message: 'Không có thông tin người dùng để đặt lại mật khẩu. Vui lòng xác thực OTP trước.' });
      return;
    }

    try {
      const user = await userRepository.findOne({ where: { email: req.user.email } });
      if (!user) {
        res.status(404).json({ message: 'Không tìm thấy người dùng với email này.' });
        return;
      }

      
      if (newPassword.trim() !== confirmPassword.trim()) {
        res.status(400).json({ 
            errors: [{ message: 'Xác nhận mật khẩu phải giống mật khẩu mới.' }] 
        });
        return;
    }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      
      await userRepository.save(user);
      
      res.status(200).json({ message: 'Mật khẩu đã được cập nhật thành công.' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi máy chủ.' });
    }
  }

}