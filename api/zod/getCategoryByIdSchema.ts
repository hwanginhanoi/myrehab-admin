import { z } from "zod";
import { categoryResponseSchema } from "./categoryResponseSchema";


export const getCategoryByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCategoryById200Schema = z.lazy(() => categoryResponseSchema);
/**
 * @description OK
 */
export const getCategoryByIdQueryResponseSchema = z.lazy(() => categoryResponseSchema);