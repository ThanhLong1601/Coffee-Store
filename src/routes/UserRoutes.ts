import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { ForgotPasswordDTO } from '../dtos/ForgotPasswordDTO';
import { VerifyOtpDTO } from '../dtos/VerifyOtpDTO';
import { ResetPasswordDTO } from '../dtos/ResetPasswordDTO';
import { authenticateJWT } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.post('/register', validationMiddleware(RegisterDTO), UserController.register);

userRouter.post('/login', validationMiddleware(LoginDTO), UserController.login);

userRouter.post('/forgot-password', validationMiddleware(ForgotPasswordDTO), UserController.forgotPassword);

userRouter.post('/verify-otp',authenticateJWT, validationMiddleware(VerifyOtpDTO), UserController.verifyOtp);

userRouter.post('/reset-password', authenticateJWT , validationMiddleware(ResetPasswordDTO), UserController.resetPassword);

export default userRouter;