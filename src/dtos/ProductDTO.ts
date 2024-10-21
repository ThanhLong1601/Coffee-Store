// import { z } from 'zod';

// export const ProductDTO = z.object({
//   id: z.number(),
//   image: z.string(),
//   name: z.string(),
// }) 
export type ProductDTO = {
  id: number;
  image: string;
  name: string;
};
