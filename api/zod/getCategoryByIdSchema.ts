import { z } from "zod";
import { exerciseCategoryResponseSchema } from "./exerciseCategoryResponseSchema";


export const getCategoryByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCategoryById200Schema = z.lazy(() => exerciseCategoryResponseSchema);
/**
 * @description OK
 */
export const getCategoryByIdQueryResponseSchema = z.lazy(() => exerciseCategoryResponseSchema);