import { z } from "zod";
import { courseSchema } from "./courseSchema";


export const getCourseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getCourseById200Schema = z.lazy(() => courseSchema);
/**
 * @description OK
 */
export const getCourseByIdQueryResponseSchema = z.lazy(() => courseSchema);