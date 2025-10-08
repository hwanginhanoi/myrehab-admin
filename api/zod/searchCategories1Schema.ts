import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";


export const searchCategories1QueryParamsSchema = z.object({ "keyword": z.string().describe("Search keyword") });
/**
 * @description OK
 */
export const searchCategories1200Schema = z.array(z.lazy(() => courseCategoryResponseSchema));
/**
 * @description OK
 */
export const searchCategories1QueryResponseSchema = z.array(z.lazy(() => courseCategoryResponseSchema));