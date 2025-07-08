import { z } from "zod";


export const authResponseSchema = z.object({ "userId": z.number().int().optional(), "token": z.string().optional(), "message": z.string().optional() });