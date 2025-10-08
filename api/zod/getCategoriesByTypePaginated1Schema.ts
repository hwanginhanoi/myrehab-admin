import { z } from "zod";
import { pageCourseCategoryResponseSchema } from "./pageCourseCategoryResponseSchema";


export const getCategoriesByTypePaginated1PathParamsSchema = z.object({ "type": z.enum(["BODY_PART", "RECOVERY_STAGE", "HEALTH_CONDITION", "DIFFICULTY_LEVEL", "EXERCISE_TYPE"]) });

 export const getCategoriesByTypePaginated1QueryParamsSchema = z.object({ "page": z.number().int().default(0).describe("Page number (0-based)").optional(), "size": z.number().int().default(10).describe("Number of items per page").optional(), "sortBy": z.string().default("name").describe("Sort by field").optional(), "sortDir": z.string().default("asc").describe("Sort direction").optional() }).optional();
/**
 * @description OK
 */
export const getCategoriesByTypePaginated1200Schema = z.lazy(() => pageCourseCategoryResponseSchema);
/**
 * @description OK
 */
export const getCategoriesByTypePaginated1QueryResponseSchema = z.lazy(() => pageCourseCategoryResponseSchema);