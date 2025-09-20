import { z } from "zod";
import { courseResponseSchema } from "./courseResponseSchema";

 /**
 * @description OK
 */
export const getAllCourses200Schema = z.array(z.lazy(() => courseResponseSchema));
/**
 * @description OK
 */
export const getAllCoursesQueryResponseSchema = z.array(z.lazy(() => courseResponseSchema));