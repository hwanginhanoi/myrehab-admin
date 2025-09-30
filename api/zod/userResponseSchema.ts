import { z } from "zod";


export const userResponseSchema = z.object({ "id": z.number().int().optional(), "fullName": z.string().optional(), "phoneNumber": z.string().optional(), "email": z.string().optional(), "enabled": z.boolean().optional(), "otpVerified": z.boolean().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });