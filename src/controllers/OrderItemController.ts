import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { OrderItem } from '../entities/OrderItemEntity';
import { OrderItemDTO } from '../dtos/OrderItemDTO';
import { orderItemSchema } from '../validations/orderItemSchema';
import { Product } from '../entities/ProductEntity';
import { OrderRistretto } from '../entities/OrderItemEntity';
import { OrderSize } from '../entities/OrderItemEntity';

export class OrderItemController {

  static async createOrderItem(req: Request, res: Response): Promise<void> {
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const productRepository = AppDataSource.getRepository(Product);
    const parsedData = orderItemSchema.safeParse(req.body);
    
    if (!parsedData.success) {
      res.status(400).json({
        status: { error: parsedData.error.errors },
        message: 'Error',
        data: null
      });
      return;
    }

    const { productId , quantity, ristretto, isOnsite, size, time_prepare, prepare_time } = parsedData.data;

    try {
        const product = await productRepository.findOne({ where: { id: productId } });
        if (!product) {
          res.status(400).json({ 
            status: 'Fail',
            message: 'Product ID not found.',
            data: null
          });
          return;
        };

        const orderItem = new OrderItem();
        orderItem.product = product;
        orderItem.quantity = quantity;
        orderItem.ristretto = OrderRistretto[ristretto as keyof typeof OrderRistretto];
        orderItem.isOnsite = isOnsite;
        orderItem.size = OrderSize[size as keyof typeof OrderSize];
        orderItem.prepare_time = prepare_time;

        await orderItemRepository.save(orderItem);

       
        const orderItemResponse: OrderItemDTO = {
            productId: product.id,
            productName: product.name,
            productImage: product.image,
            quantity: orderItem.quantity,
            ristretto: orderItem.ristretto,
            isOnsite: orderItem.isOnsite,
            size: orderItem.size,
            time_prepare: orderItem.time_prepare,
            prepare_time: orderItem.prepare_time,
            total_amount: orderItem.quantity * product.price, 
        };

        res.status(201).json({
            status: 'success',
            message: 'Order item created successfully!',
            orderItem: orderItemResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Error',
            message: 'Server error.',
            data: null
        });
    }
  }
}

