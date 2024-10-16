import { z } from "zod";

export const otpSchema = z.object({
  otp_code: z.string().min(1, "OTP code is required"),
  created_at: z.date(),
  expires_at: z.date(),
  attempts: z.number().default(0),
  isUsed: z.boolean().default(false),
});
