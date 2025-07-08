import { z } from "zod";
import { courseSchema } from "./courseSchema";


export const searchCoursesByTitleQueryParamsSchema = z.object({ "title": z.string() });
/**
 * @description OK
 */
export const searchCoursesByTitle200Schema = z.array(z.lazy(() => courseSchema));
/**
 * @description OK
 */
export const searchCoursesByTitleQueryResponseSchema = z.array(z.lazy(() => courseSchema));