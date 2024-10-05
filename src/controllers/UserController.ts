import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { User } from '../entities/User';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
              { expiresIn: '1h' }
          );

          res.status(200).json({ message: 'Đăng nhập thành công!', token, user: user.name });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Lỗi máy chủ.' });
      }
  }
}