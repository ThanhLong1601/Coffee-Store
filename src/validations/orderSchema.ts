import { z } from "zod";

export const orderSchema = z.object({
  shipping_address: z.string().min(1, "Shipping address is required"),
  discount: z.number().min(0).max(100, "Discount must be between 0 and 100").default(0),
  total_price: z.number().positive("Total price must be positive"),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});
