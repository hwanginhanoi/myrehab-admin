import { z } from "zod";
import { categoryDtoSchema } from "./categoryDtoSchema";


export const getCategoryByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCategoryById200Schema = z.lazy(() => categoryDtoSchema);
/**
 * @description OK
 */
export const getCategoryByIdQueryResponseSchema = z.lazy(() => categoryDtoSchema);