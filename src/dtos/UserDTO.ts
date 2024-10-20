import { z } from "zod";

export const UserDTO = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
});
