import { Router } from 'express';
import { StoreController } from '../controllers/StoreController';
import { authenticateJWT } from '../middlewares/authMiddleware';


const storeRouter = Router();

/**
 * @swagger
 * tags:
 *   - name: Stores
 *     description: Stores management
 */

/**
 * @swagger
 * /stores/getAllStores:
 *   get:
 *     summary: Get all stores
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique identifier for the store
 *                   name:
 *                     type: string
 *                     description: The name of the store
 *                   location:
 *                     type: string
 *                     description: The location of the store
 *                   contact:
 *                     type: string
 *                     description: The contact information for the store
 *       500:
 *         description: Internal server error
 */
storeRouter.get('/getAllStores',authenticateJWT, StoreController.getAllStores);

export default storeRouter;