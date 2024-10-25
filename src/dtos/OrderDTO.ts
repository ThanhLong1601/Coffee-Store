import { OrderItemDTO } from "./OrderItemDTO";
import { OrderStatus } from "../entities/OrderEntity";

export type OrderDTO = {
    id: number;
    userId: number;
    storeId: number;
    orderItems: OrderItemDTO[];
    shipping_address: string;
    discount: number;
    status: OrderStatus;
    total_price: number;
  };