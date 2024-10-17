import { Request, Response } from 'express';
import { Store } from '../entities/StoreEntity';
import AppDataSource from '../data-source';

export class StoreController {
    static async getAllStores(req: Request, res: Response): Promise<void> {
      try {
          const storeRepository = AppDataSource.getRepository(Store);
          const stores = await storeRepository.find();

          res.status(200).json({
              status: 'success',
              message: 'Stores retrieved successfully',
              data: stores
          });
      } catch (error) {
          res.status(500).json({
              status: 'error',
              message: 'Server error',
              data: null
          });
      }
    }

    static async getStoreById(req: Request, res: Response): Promise<void> {
        const storeRepository = AppDataSource.getRepository(Store);
        const storeId = req.params.id;
        try {
            if (isNaN(Number(storeId))) {
                res.status(400).json({
                    status: 'fail',
                    message: 'Invalid ID format',
                    data: null
                });
                return;
            }
            
            const store = await storeRepository.findOneBy({ id: Number(storeId) });
            
            if (!store) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Store not found',
                    data: null
                });
                return;
            }

            res.status(200).json({
                status: 'success',
                message: 'Store retrieved successfully',
                data: store
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Server error',
                data: null
            });
        }
    }
}
