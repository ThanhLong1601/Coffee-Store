import { OrderController } from './../controllers/OrderController';
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { orderSchema } from '../validations/orderSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';


const orderRouter = Router();

orderRouter.post('',authenticateJWT, validationMiddleware(orderSchema), OrderController.createOrder);

export default orderRouter;