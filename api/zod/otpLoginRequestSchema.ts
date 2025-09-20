import { z } from "zod";


export const otpLoginRequestSchema = z.object({ "phoneNumber": z.string().regex(new RegExp("^\\+?[1-9]\\d{1,14}$")).min(1) });