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
      const parsedData = RegisterDTO.safeParse(req.body);
      if(!parsedData.success){
        res.status(400).json({error: parsedData.error.errors});
        return;
      }

      const { name, phone, email, password } = parsedData.data;

      try {
        const existingUserByEmail = await userRepository.findOne({ where: { email } });
        if (existingUserByEmail) {
            res.status(400).json({ message: 'Email already exists.' });
            return;
        }

        const existingUserByPhone = await userRepository.findOne({ where: { phone } });
        if (existingUserByPhone) {
            res.status(400).json({ message: 'Phone already exists.' });
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

          const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

          res.status(201).json({ message: 'Registration successful!', token });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error.' });
      }
  }

  static async login(req: Request, res: Response): Promise<void> {
      const userRepository = AppDataSource.getRepository(User);
      const parsedData = LoginDTO.safeParse(req.body);
      if(!parsedData.success){
        res.status(400).json({error: parsedData.error.errors});
        return;
      }
      const { email, password } = parsedData.data;

      try {
          const user = await userRepository.findOne({ where: { email } });

          if (!user) {
              res.status(401).json({ message: 'Email or password is incorrect.' });
              return; 
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
              res.status(401).json({ message: 'Email or password is incorrect.' });
              return;
          }

          const token = jwt.sign(
              { userId: user.id, email: user.email },
              process.env.JWT_SECRET!,
              { expiresIn: '1h' } // Phần này nên làm thế nào mới an toàn ???
          );

          res.status(200).json({ message: 'Login successful!', token, user: user.name });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error.' });
      }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const otpRepository = AppDataSource.getRepository(Otp);
    const parsedData = ForgotPasswordDTO.safeParse(req.body);
      if(!parsedData.success){
        res.status(400).json({error: parsedData.error.errors});
        return;
      }
    const { email } = parsedData.data;

    try {
      const user = await userRepository.findOne({ where: { email: email } });
      if (!user) {
        res.status(404).json({ message: 'No user found with this email.' });
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

      res.status(200).json({ message: 'OTP code has been sent to your email.', resetToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  }

  static async verifyOtp(req: AuthRequest, res: Response): Promise<void> {
    const otpRepository = AppDataSource.getRepository(Otp);
    const parsedData = VerifyOtpDTO.safeParse(req.body);
      if(!parsedData.success){
        res.status(400).json({error: parsedData.error.errors});
        return;
      }
    const { otp_code } = parsedData.data;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'No user found for authentication.' });
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
        res.status(400).json({ message: 'OTP is invalid or has already been used.' });
        return;
      }

      const currentTime = new Date();
      if (currentTime > otpRecord.expires_at) {
        res.status(400).json({ message: 'OTP has expired.' });
        return;
      }

      if (otpRecord.otp_code !== otp_code) {
        otpRecord.attempts += 1;
        await otpRepository.save(otpRecord);

        if (otpRecord.attempts >= 3) {

          await otpRepository.delete(otpRecord.id);
          res.status(400).json({ message: 'You have entered the wrong OTP more than 3 times. The OTP code has been canceled.' });
        } else {
          res.status(400).json({ message: 'OTP is incorrect. Try again.' });
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

      res.status(200).json({ message: 'OTP has been successfully authenticated.', resetToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server error.'});
    }
  }

  static async resetPassword(req: AuthRequest, res: Response): Promise<void> {
    const userRepository = AppDataSource.getRepository(User);
    const parsedData = ResetPasswordDTO.safeParse(req.body);
      if(!parsedData.success){
        res.status(400).json({error: parsedData.error.errors});
        return;
      }
    const { newPassword, confirmPassword } = parsedData.data;

    if (!req.user || !req.user.id) {
      res.status(400).json({ message: 'No user information to reset password. Please verify OTP first.' });
      return;
    }

    try {
      const user = await userRepository.findOne({ where: { id: req.user.id } });
      if (!user) {
        res.status(404).json({ message: 'No user found with this email.' });
        return;
      }

      
      if (newPassword.trim() !== confirmPassword.trim()) {
        res.status(400).json({ 
            errors: [{ message: 'Confirm password must be same as new password.' }] 
        });
        return;
    }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      
      await userRepository.save(user);
      
      res.status(200).json({ message: 'Password updated successfully.' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  }

}