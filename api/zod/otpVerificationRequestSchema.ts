import { z } from "zod";


export const otpVerificationRequestSchema = z.object({ "phoneNumber": z.string().regex(new RegExp("^\\+?[1-9]\\d{1,14}$")).min(1), "otpCode": z.string().regex(new RegExp("^\\d{6}$")).min(1) });