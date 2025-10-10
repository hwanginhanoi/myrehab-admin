import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageCourseCategoryResponseSchema } from "./pageCourseCategoryResponseSchema";


export const getCategoriesByTypePaginated1PathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });

 export const getCategoriesByTypePaginated1QueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getCategoriesByTypePaginated1200Schema = z.lazy(() => pageCourseCategoryResponseSchema);
/**
 * @description OK
 */
export const getCategoriesByTypePaginated1QueryResponseSchema = z.lazy(() => pageCourseCategoryResponseSchema);