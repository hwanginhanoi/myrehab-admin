import { z } from "zod";
import { categoryDtoSchema } from "./categoryDtoSchema";

 /**
 * @description OK
 */
export const createCategory200Schema = z.lazy(() => categoryDtoSchema);

 export const createCategoryMutationRequestSchema = z.lazy(() => categoryDtoSchema);
/**
 * @description OK
 */
export const createCategoryMutationResponseSchema = z.lazy(() => categoryDtoSchema);