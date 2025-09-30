import { z } from "zod";


export const transactionResponseSchema = z.object({ "id": z.number().int().optional(), "type": z.string().optional(), "amount": z.number().optional(), "description": z.string().optional(), "createdAt": z.string().datetime().optional() });