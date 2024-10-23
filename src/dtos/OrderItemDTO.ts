import { OrderSize } from "../entities/OrderItemEntity";
import { OrderRistretto } from "../entities/OrderItemEntity";

export type OrderItemDTO = {
    productId: number;
    productName: string;
    productImage: string;
    quantity: number;
    ristretto: OrderRistretto;
    isOnsite: boolean;
    size: OrderSize;
    time_prepare: boolean;
    prepare_time?: string | null;
    total_amount: number;
}