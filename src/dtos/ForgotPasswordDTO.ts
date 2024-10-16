import { z } from "zod";

export const ForgotPasswordDTO = z.object({
  email: z.string().min(1,"Email cannot be empty").email("Invalid email format"),
});