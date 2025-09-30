import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageUserResponseSchema } from "./pageUserResponseSchema";


export const getAllUsersPaginatedQueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getAllUsersPaginated200Schema = z.lazy(() => pageUserResponseSchema);
/**
 * @description OK
 */
export const getAllUsersPaginatedQueryResponseSchema = z.lazy(() => pageUserResponseSchema);