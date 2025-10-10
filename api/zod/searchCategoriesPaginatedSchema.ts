import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageExerciseCategoryResponseSchema } from "./pageExerciseCategoryResponseSchema";


export const searchCategoriesPaginatedQueryParamsSchema = z.object({ "keyword": z.string(), "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const searchCategoriesPaginated200Schema = z.lazy(() => pageExerciseCategoryResponseSchema);
/**
 * @description OK
 */
export const searchCategoriesPaginatedQueryResponseSchema = z.lazy(() => pageExerciseCategoryResponseSchema);