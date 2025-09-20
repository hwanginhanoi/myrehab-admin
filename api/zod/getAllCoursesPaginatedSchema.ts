import { z } from "zod";
import { pageCourseResponseSchema } from "./pageCourseResponseSchema";


export const getAllCoursesPaginatedQueryParamsSchema = z.object({ "page": z.number().int().default(0).describe("Page number (0-based)").optional(), "size": z.number().int().default(10).describe("Number of items per page").optional(), "sortBy": z.string().default("createdAt").describe("Sort by field").optional(), "sortDir": z.string().default("desc").describe("Sort direction").optional() }).optional();
/**
 * @description OK
 */
export const getAllCoursesPaginated200Schema = z.lazy(() => pageCourseResponseSchema);
/**
 * @description OK
 */
export const getAllCoursesPaginatedQueryResponseSchema = z.lazy(() => pageCourseResponseSchema);