import { z } from "zod";
import { pageableSchema } from "./pageableSchema";
import { pageUserResponseSchema } from "./pageUserResponseSchema";


export const getAllUsers1QueryParamsSchema = z.object({ "pageable": z.lazy(() => pageableSchema) });
/**
 * @description OK
 */
export const getAllUsers1200Schema = z.lazy(() => pageUserResponseSchema);
/**
 * @description OK
 */
export const getAllUsers1QueryResponseSchema = z.lazy(() => pageUserResponseSchema);