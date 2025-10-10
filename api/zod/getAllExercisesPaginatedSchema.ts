import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageExerciseResponseSchema } from "./pageExerciseResponseSchema";


export const getAllExercisesPaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema), "categoryId": z.number().int().optional(), "keyword": z.string().optional() });
/**
 * @description OK
 */
export const getAllExercisesPaginated200Schema = z.lazy(() => pageExerciseResponseSchema);
/**
 * @description OK
 */
export const getAllExercisesPaginatedQueryResponseSchema = z.lazy(() => pageExerciseResponseSchema);