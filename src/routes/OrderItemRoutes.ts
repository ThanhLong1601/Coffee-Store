import { OrderItemController } from './../controllers/OrderItemController';
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/authMiddleware';
import { orderItemSchema } from '../validations/orderItemSchema';
import { validationMiddleware } from '../middlewares/validationMiddleware';


const orderItemRouter = Router();

orderItemRouter.post('',authenticateJWT, validationMiddleware(orderItemSchema), OrderItemController.createOrderItem);

export default orderItemRouter;