import { z } from "zod";


export const userInfoResponseSchema = z.object({ "id": z.number().int().optional(), "email": z.string().optional(), "fullName": z.string().optional(), "role": z.enum(["USER", "DOCTOR", "ADMIN"]).optional(), "permissions": z.array(z.string()).optional(), "phoneNumber": z.string().optional() });