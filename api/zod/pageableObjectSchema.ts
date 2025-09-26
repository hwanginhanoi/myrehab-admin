import { sortObjectSchema } from "./sortObjectSchema";
import { z } from "zod";


export const pageableObjectSchema = z.object({ "offset": z.number().int().optional(), "sort": z.lazy(() => sortObjectSchema).optional(), "unpaged": z.boolean().optional(), "paged": z.boolean().optional(), "pageNumber": z.number().int().optional(), "pageSize": z.number().int().optional() });