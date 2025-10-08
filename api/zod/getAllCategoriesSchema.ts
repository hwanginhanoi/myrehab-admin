import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";

 /**
 * @description OK
 */
export const getAllCategories200Schema = z.array(z.lazy(() => exerciseCategoryResponseSchema));
/**
 * @description OK
 */
export const getAllCategoriesQueryResponseSchema = z.array(z.lazy(() => exerciseCategoryResponseSchema));