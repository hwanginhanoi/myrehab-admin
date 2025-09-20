import { z } from "zod";
import { pageCategoryResponseSchema } from "./pageCategoryResponseSchema";


export const searchCategoriesPaginatedQueryParamsSchema = z.object({ "keyword": z.string().describe("Search keyword"), "page": z.number().int().default(0).describe("Page number (0-based)").optional(), "size": z.number().int().default(10).describe("Number of items per page").optional(), "sortBy": z.string().default("name").describe("Sort by field").optional(), "sortDir": z.string().default("asc").describe("Sort direction").optional() });
/**
 * @description OK
 */
export const searchCategoriesPaginated200Schema = z.lazy(() => pageCategoryResponseSchema);
/**
 * @description OK
 */
export const searchCategoriesPaginatedQueryResponseSchema = z.lazy(() => pageCategoryResponseSchema);