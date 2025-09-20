import { z } from "zod";


export const authResponseSchema = z.object({ "token": z.string().optional(), "refreshToken": z.string().optional(), "email": z.string().optional(), "role": z.enum(["USER", "DOCTOR", "ADMIN"]).optional(), "fullName": z.string().optional() });