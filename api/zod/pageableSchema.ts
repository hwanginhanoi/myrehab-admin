import { z } from "zod";


export const pageableSchema = z.object({ "page": z.number().int().min(0).optional(), "size": z.number().int().min(1).optional(), "sort": z.array(z.string()).optional() });