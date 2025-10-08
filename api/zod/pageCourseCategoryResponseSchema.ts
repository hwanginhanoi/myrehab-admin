import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";
import { sortObjectSchema } from "./sortObjectSchema";
import { pageableObjectSchema } from "./pageableObjectSchema";
import { z } from "zod";


export const pageCourseCategoryResponseSchema = z.object({ "totalElements": z.number().int().optional(), "totalPages": z.number().int().optional(), "first": z.boolean().optional(), "last": z.boolean().optional(), "size": z.number().int().optional(), "content": z.array(z.lazy(() => courseCategoryResponseSchema)).optional(), "number": z.number().int().optional(), "sort": z.lazy(() => sortObjectSchema).optional(), "numberOfElements": z.number().int().optional(), "pageable": z.lazy(() => pageableObjectSchema).optional(), "empty": z.boolean().optional() });