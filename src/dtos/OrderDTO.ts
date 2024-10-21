import { OrderItemDTO } from "./OrderItemDTO";

export type OrderDTO = {
    orderItems: OrderItemDTO[];
    shipping_address: string;
    discount: number;
    total_price: number;
  };