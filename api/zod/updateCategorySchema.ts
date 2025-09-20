import { z } from "zod";
import { categoryResponseSchema } from "./categoryResponseSchema";
import { updateCategoryRequestSchema } from "./updateCategoryRequestSchema";


export const updateCategoryPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCategory200Schema = z.lazy(() => categoryResponseSchema);

 export const updateCategoryMutationRequestSchema = z.lazy(() => updateCategoryRequestSchema);
/**
 * @description OK
 */
export const updateCategoryMutationResponseSchema = z.lazy(() => categoryResponseSchema);