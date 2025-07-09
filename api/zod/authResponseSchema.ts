import { z } from "zod";


export const authResponseSchema = z.object({ "token": z.string().optional(), "tokenType": z.string().optional(), "email": z.string().optional(), "role": z.string().optional() });