import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { authenticateJWT } from '../middlewares/authMiddleware';


const storeRouter = Router();

storeRouter.get('/getAllStores',authenticateJWT, StoreController.getAllStores);

export default storeRouter;