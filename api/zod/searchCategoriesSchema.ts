import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";


export const searchCategoriesQueryParamsSchema = z.object({ "keyword": z.string() });
/**
 * @description OK
 */
export const searchCategories200Schema = z.array(z.lazy(() => exerciseCategoryResponseSchema));
/**
 * @description OK
 */
export const searchCategoriesQueryResponseSchema = z.array(z.lazy(() => exerciseCategoryResponseSchema));