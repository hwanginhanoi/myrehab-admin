import { z } from "zod";
import { pageCourseCategoryResponseSchema } from "./pageCourseCategoryResponseSchema";


export const searchCategoriesPaginated1QueryParamsSchema = z.object({ "keyword": z.string().describe("Search keyword"), "page": z.number().int().default(0).describe("Page number (0-based)").optional(), "size": z.number().int().default(10).describe("Number of items per page").optional(), "sortBy": z.string().default("name").describe("Sort by field").optional(), "sortDir": z.string().default("asc").describe("Sort direction").optional() });
/**
 * @description OK
 */
export const searchCategoriesPaginated1200Schema = z.lazy(() => pageCourseCategoryResponseSchema);
/**
 * @description OK
 */
export const searchCategoriesPaginated1QueryResponseSchema = z.lazy(() => pageCourseCategoryResponseSchema);