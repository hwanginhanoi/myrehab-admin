import { z } from "zod";
import { courseResponseSchema } from "./courseResponseSchema";


export const getCoursesByCategoryPathParamsSchema = z.object({ "categoryId": z.number().int() });
/**
 * @description OK
 */
export const getCoursesByCategory200Schema = z.array(z.lazy(() => courseResponseSchema));
/**
 * @description OK
 */
export const getCoursesByCategoryQueryResponseSchema = z.array(z.lazy(() => courseResponseSchema));