import { courseResponseSchema } from "./courseResponseSchema";
import { sortObjectSchema } from "./sortObjectSchema";
import { pageableObjectSchema } from "./pageableObjectSchema";
import { z } from "zod";


export const pageCourseResponseSchema = z.object({ "totalPages": z.number().int().optional(), "totalElements": z.number().int().optional(), "first": z.boolean().optional(), "last": z.boolean().optional(), "size": z.number().int().optional(), "content": z.array(z.lazy(() => courseResponseSchema)).optional(), "number": z.number().int().optional(), "sort": z.lazy(() => sortObjectSchema).optional(), "pageable": z.lazy(() => pageableObjectSchema).optional(), "numberOfElements": z.number().int().optional(), "empty": z.boolean().optional() });