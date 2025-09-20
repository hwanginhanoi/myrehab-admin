import { z } from "zod";
import { pageExerciseResponseSchema } from "./pageExerciseResponseSchema";


export const getAllExercisesPaginatedQueryParamsSchema = z.object({ "page": z.number().int().default(0).describe("Page number (0-based)").optional(), "size": z.number().int().default(10).describe("Number of items per page").optional(), "sortBy": z.string().default("createdAt").describe("Sort by field").optional(), "sortDir": z.string().default("desc").describe("Sort direction").optional() }).optional();
/**
 * @description OK
 */
export const getAllExercisesPaginated200Schema = z.lazy(() => pageExerciseResponseSchema);
/**
 * @description OK
 */
export const getAllExercisesPaginatedQueryResponseSchema = z.lazy(() => pageExerciseResponseSchema);