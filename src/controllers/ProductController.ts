import { Request, Response } from 'express';
import { Product } from '../entities/ProductEntity';
import AppDataSource from '../data-source';
import { ProductDTO } from '../dtos/ProductDTO';
import { Store } from '../entities/StoreEntity';

export class ProductController {
    static async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            const products = await productRepository.find();

            const productResponse: ProductDTO[] = products.map((product) => ({
                id: product.id,
                image: product.image,
                name: product.name,
            }));

            res.status(200).json({
                status: 'success',
                message: 'Products retrieved successfully',
                data: productResponse
            });
        } catch (error) {
            res.status(500).json({
                status: 'error',
                message: 'Server error',
                data: null
            });
        }
    }

    static async getAllProductsByStoreId(req: Request, res: Response): Promise<void> {
        const { storeId } = req.params;

        const storeIdNumber = parseInt(storeId, 10);

        if (isNaN(storeIdNumber)) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid storeId',
                data: null
            });
            return;
        }

        try {
            const storeRepository = AppDataSource.getRepository(Store);
            const store = await storeRepository.findOne({ where: { id: storeIdNumber } });
            if (!store) {
                res.status(404).json({
                    status: 'fail',
                    message: 'Store not found',
                    data: null
                });
                return;
            }
            
            const productRepository = AppDataSource.getRepository(Product);
            const products = await productRepository.find({ where: { store: { id: storeIdNumber } } });

            const productResponse: ProductDTO[] = products.map((product) => ({
                id: product.id,
                image: product.image,
                name: product.name,
            }));

            res.status(200).json({
                status: 'success',
                message: 'Products retrieved successfully for store',
                data: productResponse
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