import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";
import { updateCourseCategoryRequestSchema } from "./updateCourseCategoryRequestSchema";


export const updateCategory1PathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCategory1200Schema = z.lazy(() => courseCategoryResponseSchema);

 export const updateCategory1MutationRequestSchema = z.lazy(() => updateCourseCategoryRequestSchema);
/**
 * @description OK
 */
export const updateCategory1MutationResponseSchema = z.lazy(() => courseCategoryResponseSchema);