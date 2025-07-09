import { z } from "zod";
import { categoryDtoSchema } from "./categoryDtoSchema";


export const updateCategoryPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCategory200Schema = z.lazy(() => categoryDtoSchema);

 export const updateCategoryMutationRequestSchema = z.lazy(() => categoryDtoSchema);
/**
 * @description OK
 */
export const updateCategoryMutationResponseSchema = z.lazy(() => categoryDtoSchema);