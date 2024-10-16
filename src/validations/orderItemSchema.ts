import { z } from "zod";

export const orderItemSchema = z.object({
  quantity: z.number().int().min(1,"Quantity cannot be empty").positive("Quantity must be a positive integer").default(1),
  ristretto: z.enum(["SMALL", "MEDIUM", "LARGE"]).default("SMALL"),
  isOnsite: z.boolean().default(false),
  size: z.enum(["SMALL", "MEDIUM", "LARGE"]).default("MEDIUM"),
  time_prepare: z.boolean().default(false),
  prepare_time: z.string().nullable().optional(),
  price: z.number().positive("Price must be positive"),
});
