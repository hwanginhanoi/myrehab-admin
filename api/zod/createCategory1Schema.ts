import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";
import { createCourseCategoryRequestSchema } from "./createCourseCategoryRequestSchema";

 /**
 * @description OK
 */
export const createCategory1200Schema = z.lazy(() => courseCategoryResponseSchema);

 export const createCategory1MutationRequestSchema = z.lazy(() => createCourseCategoryRequestSchema);
/**
 * @description OK
 */
export const createCategory1MutationResponseSchema = z.lazy(() => courseCategoryResponseSchema);