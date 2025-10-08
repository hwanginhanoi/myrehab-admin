import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";
import { updateExerciseCategoryRequestSchema } from "./updateExerciseCategoryRequestSchema";


export const updateCategoryPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCategory200Schema = z.lazy(() => exerciseCategoryResponseSchema);

 export const updateCategoryMutationRequestSchema = z.lazy(() => updateExerciseCategoryRequestSchema);
/**
 * @description OK
 */
export const updateCategoryMutationResponseSchema = z.lazy(() => exerciseCategoryResponseSchema);