import { z } from "zod";
import { courseSchema } from "./courseSchema";


export const getCoursesByCategoryIdPathParamsSchema = z.object({ "categoryId": z.number().int() });
/**
 * @description OK
 */
export const getCoursesByCategoryId200Schema = z.array(z.lazy(() => courseSchema));
/**
 * @description OK
 */
export const getCoursesByCategoryIdQueryResponseSchema = z.array(z.lazy(() => courseSchema));