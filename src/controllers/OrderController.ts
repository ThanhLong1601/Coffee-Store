import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { Order } from '../entities/OrderEntity';
import { OrderDTO } from '../dtos/OrderDTO'; 
import { OrderItem } from '../entities/OrderItemEntity';
import { OrderItemDTO } from '../dtos/OrderItemDTO';
import { orderSchema } from '../validations/orderSchema';
import { In } from 'typeorm';

export class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        const orderRepository = AppDataSource.getRepository(Order);
        const orderItemRepository = AppDataSource.getRepository(OrderItem);
        const parsedData = orderSchema.safeParse(req.body);
        
        if (!parsedData.success) {
            res.status(400).json({
                status: { error: parsedData.error.errors },
                message: 'Error',
                data: null
            });
            return;
        }
    
        const { userId, storeId, orderItems, shipping_address, discount } = parsedData.data;
    
        try {
            const orderItemEntities = await orderItemRepository.findBy({
                id: In(orderItems.map(item => item.productId))
            });
    
            if (orderItemEntities.length !== orderItems.length) {
                res.status(404).json({ 
                    status: 'Fail', 
                    message: 'One or more OrderItems not found.', 
                    data: null 
                });
                return;
            }
    
            const total_price = orderItemEntities.reduce((total, item) => {
                if (item.product && item.product.price) {
                    return total + (item.quantity * item.product.price);
                } else {
                    console.error(`Product not found or price is undefined for item ID: ${item.id}`);
                    return total; 
                }
            }, 0) - discount; 
    
            const order = orderRepository.create({
                user: { id: userId },
                store: { id: storeId },
                shipping_address,
                discount,
                total_price,
            });
          
            const savedOrder = await orderRepository.save(order);
    
            await orderItemRepository.update(
                { id: In(orderItemEntities.map(item => item.id)) },
                { order: savedOrder }
            );
    
            const orderItemDTOs: OrderItemDTO[] = orderItemEntities.map((item) => {
                return {
                    productId: item.product.id,
                    productName: item.product.name,
                    productImage: item.product.image,
                    quantity: item.quantity,
                    ristretto: item.ristretto,
                    isOnsite: item.isOnsite,
                    size: item.size,
                    time_prepare: item.time_prepare,
                    prepare_time: item.prepare_time,
                    total_amount: item.quantity * (item.product.price || 0),
                };
            });
    
            const orderResponse: OrderDTO = {
                userId: savedOrder.user.id,
                storeId: savedOrder.store.id,
                shipping_address: savedOrder.shipping_address,
                discount: savedOrder.discount,
                total_price: savedOrder.total_price,
                orderItems: orderItemDTOs,
            };
    
            res.status(201).json({
                status: 'success',
                message: 'Order created successfully!',
                order: orderResponse
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
