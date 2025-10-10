import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageExerciseCategoryResponseSchema } from "./pageExerciseCategoryResponseSchema";


export const getAllCategoriesPaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getAllCategoriesPaginated200Schema = z.lazy(() => pageExerciseCategoryResponseSchema);
/**
 * @description OK
 */
export const getAllCategoriesPaginatedQueryResponseSchema = z.lazy(() => pageExerciseCategoryResponseSchema);