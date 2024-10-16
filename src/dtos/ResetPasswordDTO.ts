import { z } from "zod";

export const ResetPasswordDTO = z.object({
  newPassword: z.string().min(1,"Password cannot be empty").min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters")
});
