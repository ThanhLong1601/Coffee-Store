import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { authenticateJWT } from '../middlewares/authMiddleware';


const storeRouter = Router();

storeRouter.get('',authenticateJWT, StoreController.getAllStores);

storeRouter.get('/:id', authenticateJWT, StoreController.getStoreById);

export default storeRouter;