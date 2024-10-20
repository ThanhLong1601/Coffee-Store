import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { RegisterSchema } from '../validations/RegisterSchema';
import { LoginSchema } from '../validations/LoginSchema';
import { ForgotPasswordSchema } from '../validations/ForgotPasswordSchema';
import { VerifyOtpSchema } from '../validations/VerifyOtpSchema';
import { ResetPasswordSchema } from '../validations/ResetPasswordSchema';

const userRouter = Router();

userRouter.post('/register', validationMiddleware(RegisterSchema), UserController.register);

userRouter.post('/login', validationMiddleware(LoginSchema), UserController.login);

userRouter.post('/forgot-password', validationMiddleware(ForgotPasswordSchema), UserController.forgotPassword);

userRouter.post('/verify-otp',authenticateJWT, validationMiddleware(VerifyOtpSchema), UserController.verifyOtp);

userRouter.post('/reset-password', authenticateJWT , validationMiddleware(ResetPasswordSchema), UserController.resetPassword);

export default userRouter;