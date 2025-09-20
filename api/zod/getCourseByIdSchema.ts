import { z } from "zod";
import { courseResponseSchema } from "./courseResponseSchema";


export const getCourseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCourseById200Schema = z.lazy(() => courseResponseSchema);
/**
 * @description OK
 */
export const getCourseByIdQueryResponseSchema = z.lazy(() => courseResponseSchema);