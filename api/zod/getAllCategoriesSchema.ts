import { z } from "zod";
import { categoryResponseSchema } from "./categoryResponseSchema";

 /**
 * @description OK
 */
export const getAllCategories200Schema = z.array(z.lazy(() => categoryResponseSchema));
/**
 * @description OK
 */
export const getAllCategoriesQueryResponseSchema = z.array(z.lazy(() => categoryResponseSchema));