import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";
import { sortObjectSchema } from "./sortObjectSchema";
import { pageableObjectSchema } from "./pageableObjectSchema";
import { z } from "zod";


export const pageExerciseCategoryResponseSchema = z.object({ "totalPages": z.number().int().optional(), "totalElements": z.number().int().optional(), "first": z.boolean().optional(), "last": z.boolean().optional(), "size": z.number().int().optional(), "content": z.array(z.lazy(() => exerciseCategoryResponseSchema)).optional(), "number": z.number().int().optional(), "sort": z.lazy(() => sortObjectSchema).optional(), "pageable": z.lazy(() => pageableObjectSchema).optional(), "numberOfElements": z.number().int().optional(), "empty": z.boolean().optional() });