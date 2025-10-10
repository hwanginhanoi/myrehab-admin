import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageCourseResponseSchema } from "./pageCourseResponseSchema";


export const getAllCoursesPaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getAllCoursesPaginated200Schema = z.lazy(() => pageCourseResponseSchema);
/**
 * @description OK
 */
export const getAllCoursesPaginatedQueryResponseSchema = z.lazy(() => pageCourseResponseSchema);