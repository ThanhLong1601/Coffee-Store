import { z } from "zod";

export const VerifyOtpDTO = z.object({
  otp_code: z.string().min(1, "OTP code is required"),
});
