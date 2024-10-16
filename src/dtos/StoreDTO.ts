import { z } from "zod";

export const StoreDTO = z.object({
  name: z.string().min(1, "Store name is required"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});
