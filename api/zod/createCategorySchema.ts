import { z } from "zod";
import { categoryResponseSchema } from "./categoryResponseSchema";
import { createCategoryRequestSchema } from "./createCategoryRequestSchema";

 /**
 * @description OK
 */
export const createCategory200Schema = z.lazy(() => categoryResponseSchema);

 export const createCategoryMutationRequestSchema = z.lazy(() => createCategoryRequestSchema);
/**
 * @description OK
 */
export const createCategoryMutationResponseSchema = z.lazy(() => categoryResponseSchema);