import { z } from 'zod';

export const ProductDTO = z.object({
  image: z.string().url("Invalid image URL").min(1,"Image cannot be empty"),
  name: z.string().min(1,"Product name cannot be empty"),
}) 
