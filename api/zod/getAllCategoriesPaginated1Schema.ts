import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageCourseCategoryResponseSchema } from "./pageCourseCategoryResponseSchema";


export const getAllCategoriesPaginated1QueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getAllCategoriesPaginated1200Schema = z.lazy(() => pageCourseCategoryResponseSchema);
/**
 * @description OK
 */
export const getAllCategoriesPaginated1QueryResponseSchema = z.lazy(() => pageCourseCategoryResponseSchema);