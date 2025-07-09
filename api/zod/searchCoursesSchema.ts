import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const searchCoursesQueryParamsSchema = z.object({ "title": z.string() });
/**
 * @description OK
 */
export const searchCourses200Schema = z.array(z.lazy(() => courseDtoSchema));
/**
 * @description OK
 */
export const searchCoursesQueryResponseSchema = z.array(z.lazy(() => courseDtoSchema));