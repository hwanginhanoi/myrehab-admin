import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";
import { createExerciseCategoryRequestSchema } from "./createExerciseCategoryRequestSchema";

 /**
 * @description OK
 */
export const createCategory200Schema = z.lazy(() => exerciseCategoryResponseSchema);

 export const createCategoryMutationRequestSchema = z.lazy(() => createExerciseCategoryRequestSchema);
/**
 * @description OK
 */
export const createCategoryMutationResponseSchema = z.lazy(() => exerciseCategoryResponseSchema);