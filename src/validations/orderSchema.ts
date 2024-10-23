import { z } from "zod";
import { orderItemSchema } from "./orderItemSchema";

export const orderSchema = z.object({
  userId: z.number().min(1, "UserID can not be empty"),
  storeId: z.number().min(1, "StoreID can not be empty"),
  shipping_address: z.string().min(1, "Shipping address is required"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100").default(0),
  orderItems: z.array(orderItemSchema)
});
