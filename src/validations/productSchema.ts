import { z } from "zod";

export const productSchema = z.object({
  image: z.string().url("Invalid image URL").min(1,"Image cannot be empty"),
  name: z.string().min(1,"Product name cannot be empty"),
  price: z.number().positive("Price must be positive").min(1,"Price cannot be empty"),
});
