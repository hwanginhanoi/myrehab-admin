import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageCourseCategoryResponseSchema } from "./pageCourseCategoryResponseSchema";


export const searchCategoriesPaginated1QueryParamsSchema = z.object({ "keyword": z.string(), "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const searchCategoriesPaginated1200Schema = z.lazy(() => pageCourseCategoryResponseSchema);
/**
 * @description OK
 */
export const searchCategoriesPaginated1QueryResponseSchema = z.lazy(() => pageCourseCategoryResponseSchema);