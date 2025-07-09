import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const getCoursesByCategoryPathParamsSchema = z.object({ "categoryId": z.number().int() });
/**
 * @description OK
 */
export const getCoursesByCategory200Schema = z.array(z.lazy(() => courseDtoSchema));
/**
 * @description OK
 */
export const getCoursesByCategoryQueryResponseSchema = z.array(z.lazy(() => courseDtoSchema));