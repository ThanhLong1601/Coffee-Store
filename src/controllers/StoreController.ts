import { Request, Response } from 'express';
import { Store } from '../entities/StoreEntity';
import AppDataSource from '../data-source';

export class StoreController {
    static async getAllStores(req: Request, res: Response): Promise<void> {
      try {
          const storeRepository = AppDataSource.getRepository(Store);
          const stores = await storeRepository.find();
          res.status(200).json(stores);
      } catch (error) {
          res.status(500).json({ message: 'Lỗi máy chủ' });
      }
    }

}