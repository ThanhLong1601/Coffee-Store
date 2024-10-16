import { z } from "zod";

export const RegisterDTO = z.object({
  name: z.string().min(1,"Name cannot be empty").min(2, "Name must be at least 2 characters").trim(),
  phone: z.string().min(1,"Phone cannot be empty").regex(/^\+?\d{10,15}$/, "Phone number must be between 10 to 15 characters and can start with '+'"),
  email: z.string().min(1,"Email cannot be empty").email("Invalid email format"),
  password: z.string().min(1,"Password cannot be empty").min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
});
