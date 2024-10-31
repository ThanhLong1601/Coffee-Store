import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Order, OrderStatus } from "../entities/OrderEntity";
import { OrderDTO } from "../dtos/OrderDTO";
import { OrderItem } from "../entities/OrderItemEntity";
import { orderSchema } from "../validations/orderSchema";
import { OrderItemDTO } from "../dtos/OrderItemDTO";
import { orderItemSchema } from "../validations/orderItemSchema";
import { Product } from "../entities/ProductEntity";
import { OrderRistretto } from "../entities/OrderItemEntity";
import { OrderSize } from "../entities/OrderItemEntity";
import { AuthRequest } from "../middlewares/authMiddleware";
import { In } from "typeorm";
import { parse } from "path";

export class OrderController {
  static async addOrderItemToOrder(
    req: AuthRequest,
    res: Response
  ): Promise<void> {
    const orderItemData = req.body;
    const orderRepository = AppDataSource.getRepository(Order);
    const orderItemRepository = AppDataSource.getRepository(OrderItem);
    const productRepository = AppDataSource.getRepository(Product);

    // const parsedData = orderItemSchema.safeParse(orderItemData);
    // if (!parsedData.success) {
    //     res.status(400).json({
    //         status: 'Error',
    //         message: 'Invalid data provided',
    //         data: parsedData.error.errors
    //     });
    //     return;
    // }

    const {
      productId,
      quantity,
      ristretto,
      isOnsite,
      size,
      time_prepare,
      prepare_time,
    } = orderItemData;

    const userId = req.user?.id;
    // if (!userId) {
    //   res.status(401).json({
    //     status: "Error",
    //     message: "Unauthorized",
    //     data: null,
    //   });
    //   return;
    // }

    try {
      const product = await productRepository.findOne({
        where: { id: productId },
        relations: ["store"],
      });
      if (!product) {
        res.status(404).json({
          status: "Error",
          message: `Product with ID ${productId} not found.`,
          data: null,
        });
        return;
      }

      let order = await orderRepository.findOne({
        where: {
          user: { id: userId },
          status: In([OrderStatus.INIT, OrderStatus.PENDING]),
        },
        relations: ["orderItems"],
      });

      if (!order) {
        order = orderRepository.create({
          user: { id: userId },
          store: { id: product.store.id },
          status: OrderStatus.INIT,
          shipping_address: "",
          discount: 0,
          total_price: 0,
        });
        order = await orderRepository.save(order);
      }

      const orderItem = orderItemRepository.create({
        product,
        order,
        quantity,
        ristretto: OrderRistretto[ristretto],
        isOnsite,
        size: OrderSize[size],
        time_prepare,
        prepare_time,
      });

      await orderItemRepository.save(orderItem);

      const totalAmount = product.price * quantity;
      order.total_price = (order.total_price || 0) + totalAmount;
      const discountAmount = (order.discount / 100) * order.total_price;
      order.total_price -= discountAmount;

      if (order.status === OrderStatus.INIT) {
        order.status = OrderStatus.PENDING;
      }

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
        total_amount: totalAmount,
      };

      res.status(201).json({
        status: "Success",
        message: "Order item added successfully!",
        orderItem: orderItemDTO,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        data: null,
      });
    }
  }

  static async updateOrder(req: AuthRequest, res: Response): Promise<void> {
    const userId = req.user?.id;
    const orderId = parseInt(req.params.orderId, 10);

    if (!userId) {
      res.status(401).json({
        status: "Error",
        message: "Unauthorized",
        data: null,
      });
      return;
    }

    const orderData = req.body;
    const orderRepository = AppDataSource.getRepository(Order);

    const parsedData = orderSchema.safeParse(orderData);
    if (!parsedData.success) {
      res.status(400).json({
        status: "Error",
        message: "Invalid data provided",
        data: parsedData.error.errors,
      });
      return;
    }

    const { shipping_address, discount } = parsedData.data;

    try {
      const order = await orderRepository.findOne({
        where: {
          id: orderId,
          user: { id: userId },
          status: In([OrderStatus.INIT, OrderStatus.PENDING]),
        },
      });

      if (!order) {
        res.status(404).json({
          status: "Error",
          message: "Order not found",
          data: null,
        });
        return;
      }

      order.shipping_address = shipping_address;
      order.discount = discount;

      await orderRepository.save(order);

      const orderResponse: OrderDTO = {
        id: order.id,
        userId: order.user.id,
        storeId: order.store.id,
        shipping_address: order.shipping_address,
        discount: order.discount,
        status: order.status,
        total_price: order.total_price,
        orderItems: order.orderItems.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          productImage: item.product.image,
          quantity: item.quantity,
          ristretto: item.ristretto,
          isOnsite: item.isOnsite,
          size: item.size,
          time_prepare: item.time_prepare,
          prepare_time: item.prepare_time,
          total_amount: item.quantity * item.product.price,
        })),
      };

      res.status(200).json({
        status: "Success",
        message: "Order updated successfully!",
        order: orderResponse,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "Error",
        message: "Server error",
        data: null,
      });
    }
  }
}
