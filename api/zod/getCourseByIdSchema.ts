import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const getCourseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCourseById200Schema = z.lazy(() => courseDtoSchema);
/**
 * @description OK
 */
export const getCourseByIdQueryResponseSchema = z.lazy(() => courseDtoSchema);