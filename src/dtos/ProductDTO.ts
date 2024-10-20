import { z } from 'zod';

export const ProductDTO = z.object({
  image: z.string(),
  name: z.string(),
}) 
