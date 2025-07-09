import { z } from "zod";
import { categoryDtoSchema } from "./categoryDtoSchema";

 /**
 * @description OK
 */
export const getAllCategories200Schema = z.array(z.lazy(() => categoryDtoSchema));
/**
 * @description OK
 */
export const getAllCategoriesQueryResponseSchema = z.array(z.lazy(() => categoryDtoSchema));