import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { RegisterDTO } from '../dtos/RegisterDTO';
import { LoginDTO } from '../dtos/LoginDTO';

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

export default router;