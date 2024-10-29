import { OrderController } from './../controllers/OrderController';
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { orderSchema } from '../validations/orderSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';
import { orderItemSchema } from '../validations/orderItemSchema';


const orderRouter = Router();

orderRouter.post('/',authenticateJWT, validationMiddleware(orderItemSchema), OrderController.addOrderItemToOrder);

orderRouter.put('/:orderId',authenticateJWT, validationMiddleware(orderSchema), OrderController.updateOrder);

export default orderRouter;