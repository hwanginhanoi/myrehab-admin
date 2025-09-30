import { z } from "zod";


export const addBalanceRequestSchema = z.object({ "amount": z.number(), "description": z.string().optional() });