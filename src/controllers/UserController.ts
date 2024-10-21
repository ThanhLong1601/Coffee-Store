import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { User } from '../entities/UserEntity';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Otp } from '../entities/OtpEntity';
import { sendOtpEmail } from '../services/emailService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { RegisterSchema } from '../validations/RegisterSchema';
import { UserDTO } from '../dtos/UserDTO';
import { LoginSchema } from '../validations/LoginSchema';
import { ForgotPasswordSchema } from '../validations/ForgotPasswordSchema';
import { VerifyOtpSchema } from '../validations/VerifyOtpSchema';
import { ResetPasswordSchema } from '../validations/ResetPasswordSchema';

export class UserController {
  
  static async register(req: Request, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const parsedData = RegisterSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        status: {error: parsedData.error.errors},
        message: 'Error',
        data: null
      });
      return;
    }

    const { name, phone, email, password } = parsedData.data;

    try {
      const existingUserByEmail = await userRepository.findOne({ where: { email } });
      if (existingUserByEmail) {
        res.status(400).json({ 
          status: 'Fail',
          message: 'Email already exists.',
          data: null
        });
        return;
      }

      const existingUserByPhone = await userRepository.findOne({ where: { phone } });
      if (existingUserByPhone) {
        res.status(400).json({ 
          status: 'Fail',
          message: 'Phone already exists.',
          data: null
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({
        name,
        phone,
        email,
        password: hashedPassword,
      });

      await userRepository.save(user);

      const userResponse: UserDTO = {
        name: user.name,
        phone: user.phone,
        email: user.email,
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      res.status(201).json({ 
        status: 'success',
        message: 'Registration successful!',
        user: userResponse,
        token: token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        status: 'Error',
        message: 'Server error.',
        data: null
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const parsedData = LoginSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        status: {error: parsedData.error.errors},
        message: 'Error',
        data: null
      });
      return;
    }
    const { email, password } = parsedData.data;

    try {
      const user = await userRepository.findOne({ where: { email } });

      if (!user) {
        res.status(403).json({
          status: 'Fail',
          message: 'Email or password is incorrect.',
          data: null
        });
        return; 
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(403).json({
          status: 'Fail',
          message: 'Email or password is incorrect.',
          data: null
        });
        return;
      }

      const userResponse: UserDTO = {
        name: user.name,
        phone: user.phone,
        email: user.email,
      };

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' } // Phần này nên làm thế nào mới an toàn ???
      );

      res.status(200).json({ 
        status: 'success',
        message: 'Login successful!', 
        user: userResponse ,
        token: token
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        status: 'Error',
        message: 'Server error.',
        data: null
      });
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(Otp);
    const parsedData = ForgotPasswordSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        status: {error: parsedData.error.errors},
        message: 'Error',
        data: null
      });
      return;
    }
    const { email } = parsedData.data;

    try {
      const user = await userRepository.findOne({ where: { email: email } });
      if (!user) {
        res.status(404).json({ 
          status: 'Fail',
          message: 'No user found with this email.',
          data: null 
        });
        return;
      }

      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      const otp = otpRepository.create({
        otp_code: otpCode,
        user: user,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), 
        attempts: 0,
        isUsed: false
      });

      await otpRepository.save(otp);

      await sendOtpEmail(email, otpCode);

      const resetToken = jwt.sign(
        {userId: user.id},
        process.env.JWT_SECRET!,
        {expiresIn: '5m'}
      );

      res.status(200).json({
        status: 'success', 
        message: 'OTP code has been sent to your email.', 
        tokenReset: resetToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
          status: 'Error',
          message: 'Server error.',
          data: null
        });
    }
  }

  static async verifyOtp(req: AuthRequest, res: Response): Promise<void> {
    const otpRepository = AppDataSource.getRepository(Otp);
    const parsedData = VerifyOtpSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        status: {error: parsedData.error.errors},
        message: 'Error',
        data: null
      });
      return;
    }

    const { otp_code } = parsedData.data;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ 
        status: 'Fail',
        message: 'No user found for authentication.',
        data: null 
      });
      return;
    }

    try {
      const otpRecord = await otpRepository.findOne({
        where: {
          user: {id: userId},
          isUsed: false,
        },
        relations: ['user'],
        order: { created_at: 'DESC' },
      });

      if (!otpRecord) {
        res.status(400).json({ 
          status: 'Fail',
          message: 'OTP is invalid or has already been used.',
          data: null 
        });
        return;
      }

      const currentTime = new Date();
      if (currentTime > otpRecord.expires_at) {
        res.status(400).json({ 
          status: 'Fail',
          message: 'OTP has expired.',
          data: null
        });
        return;
      }

      if (otpRecord.otp_code !== otp_code) {
        otpRecord.attempts += 1;
        await otpRepository.save(otpRecord);

        if (otpRecord.attempts >= 3) {
          await otpRepository.delete(otpRecord.id);
          res.status(400).json({ 
            status: 'Fail',
            message: 'You have entered the wrong OTP more than 3 times. The OTP code has been canceled.',
            data: null 
          });
        } else {
          res.status(400).json({ 
            status: 'Fail',
            message: 'OTP is incorrect. Try again.',
            data: null 
          });
        }
        return;
      }

      otpRecord.isUsed = true;
      await otpRepository.save(otpRecord);

      const resetToken = jwt.sign(
        {userId: otpRecord.user.id, email: otpRecord.user.email, otpId: otpRecord.id},
        process.env.JWT_SECRET!,
        {expiresIn: '5m'}
      );

      res.status(200).json({
        status: 'success',
        message: 'OTP has been successfully authenticated.', 
        tokenReset: resetToken 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        status: 'Error',
        message: 'Server error.',
        data: null
      });
    }
  }

  static async resetPassword(req: AuthRequest, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const parsedData = ResetPasswordSchema.safeParse(req.body);
    if(!parsedData.success){
      res.status(400).json({
        status: {error: parsedData.error.errors},
        message: 'Error',
        data: null
      });
      return;
    }
    const { newPassword, confirmPassword } = parsedData.data;

    if (!req.user || !req.user.id) {
      res.status(400).json({ 
        status: 'Fail',
        message: 'No user information to reset password. Please verify OTP first.',
        data: null
      });
      return;
    }

    try {
      const user = await userRepository.findOne({ where: { id: req.user.id } });
      if (!user) {
        res.status(404).json({ 
          status: 'Fail',
          message: 'No user found with this email.',
          data: null
        });
        return;
      }

      if (newPassword.trim() !== confirmPassword.trim()) {
        res.status(400).json({ 
            errors: [{ 
              status: 'Fail',
              message: 'Confirm password must be same as new password.',
              data: null 
            }] 
        });
        return;
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      
      await userRepository.save(user);
      
      res.status(200).json({
        status: 'success',
        message: 'Password updated successfully.'
      });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        status: 'Error',
        message: 'Server error.',
        data: null
      });
    }
  }
}