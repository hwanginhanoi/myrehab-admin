import { z } from "zod";
import { courseCategoryResponseSchema } from "./courseCategoryResponseSchema";


export const getCategoryById1PathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCategoryById1200Schema = z.lazy(() => courseCategoryResponseSchema);
/**
 * @description OK
 */
export const getCategoryById1QueryResponseSchema = z.lazy(() => courseCategoryResponseSchema);