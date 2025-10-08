import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";


export const getCategoriesByType1PathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });
/**
 * @description OK
 */
export const getCategoriesByType1200Schema = z.array(z.lazy(() => courseCategoryResponseSchema));
/**
 * @description OK
 */
export const getCategoriesByType1QueryResponseSchema = z.array(z.lazy(() => courseCategoryResponseSchema));