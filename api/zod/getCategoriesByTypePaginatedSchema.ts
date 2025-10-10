import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageExerciseCategoryResponseSchema } from "./pageExerciseCategoryResponseSchema";


export const getCategoriesByTypePaginatedPathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });

 export const getCategoriesByTypePaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getCategoriesByTypePaginated200Schema = z.lazy(() => pageExerciseCategoryResponseSchema);
/**
 * @description OK
 */
export const getCategoriesByTypePaginatedQueryResponseSchema = z.lazy(() => pageExerciseCategoryResponseSchema);