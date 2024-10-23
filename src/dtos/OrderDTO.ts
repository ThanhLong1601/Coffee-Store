import { OrderItemDTO } from "./OrderItemDTO";

export type OrderDTO = {
    userId: number;
    storeId: number;
    orderItems: OrderItemDTO[];
    shipping_address: string;
    discount: number;
    total_price: number;
  };