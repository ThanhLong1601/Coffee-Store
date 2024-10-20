import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1,"Email cannot be empty").email("Invalid email format"),
  password: z.string().min(1,"Password cannot be empty").min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
});