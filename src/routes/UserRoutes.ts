import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';
import { ForgotPasswordDTO } from '../dtos/ForgotPasswordDTO';
import { VerifyOtpDTO } from '../dtos/VerifyOtpDTO';
import { ResetPasswordDTO } from '../dtos/ResetPasswordDTO';
import { authenticateJWT } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User management
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Email đã được sử dụng
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/register', validationMiddleware(RegisterDTO), UserController.register);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/login', validationMiddleware(LoginDTO), UserController.login);
/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     summary: Request password reset OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP đã được gửi về email
 *       404:
 *         description: Không tìm thấy người dùng với email này
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/forgot-password', validationMiddleware(ForgotPasswordDTO), UserController.forgotPassword);

/**
 * @swagger
 * /users/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP đã được xác thực thành công
 *       400:
 *         description: OTP không hợp lệ hoặc đã hết hạn
 *       401:
 *         description: Thiếu hoặc không hợp lệ token xác thực
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/verify-otp', validationMiddleware(VerifyOtpDTO), UserController.verifyOtp);

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Reset password using verified OTP
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               confirmPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Mật khẩu đã được cập nhật
 *       400:
 *         description: Mật khẩu không khớp
 *       401:
 *         description: Thiếu hoặc không hợp lệ token xác thực
 *       403:
 *         description: Token không hợp lệ hoặc đã hết hạn
 *       500:
 *         description: Lỗi máy chủ
 */
router.post('/reset-password', authenticateJWT , validationMiddleware(ResetPasswordDTO), UserController.resetPassword);

export default router;