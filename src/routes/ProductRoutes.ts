import { Router } from 'express';
import { ProductController } from './../controllers/ProductController';
import { authenticateJWT } from '../middlewares/authMiddleware';


const productRouter = Router();

productRouter.get('',authenticateJWT, ProductController.getAllProducts);

productRouter.get('/:storeId', authenticateJWT, ProductController.getAllProductsByStoreId);

export default productRouter;