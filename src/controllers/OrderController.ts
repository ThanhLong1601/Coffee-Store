import { Request, Response } from 'express';
import AppDataSource from '../data-source';
import { Order, OrderStatus } from '../entities/OrderEntity';
import { OrderDTO } from '../dtos/OrderDTO'; 
import { OrderItem } from '../entities/OrderItemEntity';
import { orderSchema } from '../validations/orderSchema';
import { OrderItemDTO } from '../dtos/OrderItemDTO';
import { orderItemSchema } from '../validations/orderItemSchema';
import { Product } from '../entities/ProductEntity';
import { OrderRistretto } from '../entities/OrderItemEntity';
import { OrderSize } from '../entities/OrderItemEntity';

export class OrderController {
    static async createOrder(req: Request, res: Response): Promise<void> {
        const orderRepository = AppDataSource.getRepository(Order);
        const parsedData = orderSchema.safeParse(req.body);
        
        if (!parsedData.success) {
            res.status(400).json({
                status: { error: parsedData.error.errors },
                message: 'Error',
                data: null
            });
            return;
        }

        const { userId, storeId, shipping_address, discount } = parsedData.data;

        try {
            const order = orderRepository.create({
                user: { id: userId },
                store: { id: storeId },
                shipping_address,
                discount,
                status: OrderStatus.INIT, 
                total_price: 0
            });

            await orderRepository.save(order);

            const orderResponse: OrderDTO = {
                id: order.id,
                userId: order.user.id,
                storeId: order.store.id,
                shipping_address: order.shipping_address,
                discount: order.discount,
                status: order.status,
                total_price: order.total_price, 
                orderItems: []
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
    
    static async addOrderItemToOrder(req: Request, res: Response): Promise<void> {
        const orderId = parseInt(req.params.orderId); 
        const orderItemData = req.body; 

        const orderRepository = AppDataSource.getRepository(Order);
        const orderItemRepository = AppDataSource.getRepository(OrderItem);
        const productRepository = AppDataSource.getRepository(Product);

        const parsedData = orderItemSchema.safeParse(orderItemData);
        if (!parsedData.success) {
            res.status(400).json({
                status: { error: parsedData.error.errors },
                message: 'Error',
                data: null
            });
            return;
        }

        const { productId, quantity, ristretto, isOnsite, size, time_prepare, prepare_time } = parsedData.data;

        try {
            const order = await orderRepository.findOne({ where: { id: orderId }, relations: ['orderItems'] });
            if (!order) {
                res.status(404).json({
                    status: 'Error',
                    message: 'Order not found',
                    data: null
                });
                return;
            }

            const product = await productRepository.findOne({ where: { id: productId } });
            if (!product) {
                res.status(400).json({ 
                    status: 'Fail',
                    message: 'Product ID not found.',
                    data: null
                });
                return;
            }

            const orderItem = new OrderItem();
            orderItem.product = product;
            orderItem.quantity = quantity;
            orderItem.ristretto = OrderRistretto[ristretto];
            orderItem.isOnsite = isOnsite;
            orderItem.size = OrderSize[size];
            orderItem.time_prepare = time_prepare;
            orderItem.prepare_time = prepare_time;
            orderItem.order = order;

            console.log(orderItem);
            await orderItemRepository.save(orderItem);

            const totalAmount = product.price * orderItem.quantity;
            order.total_price = (order.total_price || 0) + totalAmount;;

            const discountAmount = (order.discount / 100) * order.total_price;
            order.total_price -= discountAmount;

            await orderRepository.save(order);

            const orderItemDTO: OrderItemDTO = {
                productId: orderItem.product.id,
                productName: orderItem.product.name,
                productImage: orderItem.product.image,
                quantity: orderItem.quantity,
                ristretto: orderItem.ristretto,
                isOnsite: orderItem.isOnsite,
                size: orderItem.size,
                time_prepare: orderItem.time_prepare,
                prepare_time: orderItem.prepare_time,
                total_amount: totalAmount
            };

            res.status(201).json({
                status: 'success',
                message: 'Order item added successfully!',
                orderItem: orderItemDTO
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
