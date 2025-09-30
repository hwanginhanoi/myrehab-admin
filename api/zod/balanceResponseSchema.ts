import { z } from "zod";


export const balanceResponseSchema = z.object({ "id": z.number().int().optional(), "balance": z.number().optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });