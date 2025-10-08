import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";


export const getCategoriesByTypePathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });
/**
 * @description OK
 */
export const getCategoriesByType200Schema = z.array(z.lazy(() => exerciseCategoryResponseSchema));
/**
 * @description OK
 */
export const getCategoriesByTypeQueryResponseSchema = z.array(z.lazy(() => exerciseCategoryResponseSchema));