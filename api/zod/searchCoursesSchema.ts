import { z } from "zod";
import { courseResponseSchema } from "./courseResponseSchema";


export const searchCoursesQueryParamsSchema = z.object({ "keyword": z.string().describe("Search keyword") });
/**
 * @description OK
 */
export const searchCourses200Schema = z.array(z.lazy(() => courseResponseSchema));
/**
 * @description OK
 */
export const searchCoursesQueryResponseSchema = z.array(z.lazy(() => courseResponseSchema));