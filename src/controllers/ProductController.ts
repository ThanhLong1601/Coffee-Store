import { Request, Response } from 'express';
import { Product } from '../entities/ProductEntity';
import AppDataSource from '../data-source';
import { ProductDTO } from '../dtos/ProductDTO';

export class ProductController {
    static async getAllProducts(req: Request, res: Response): Promise<void> {
        try {
            const productRepository = AppDataSource.getRepository(Product);
            const products = await productRepository.find();

            const productResponse = products.map((product) => {
                return ProductDTO.parse({
                    id: product.id,
                    image: product.image,
                    name: product.name,
                });
            });

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
}