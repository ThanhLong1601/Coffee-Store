import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1,"Name cannot be empty"),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
});
