import { z } from "zod";

export const StoreDTO = z.object({
  name: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});
