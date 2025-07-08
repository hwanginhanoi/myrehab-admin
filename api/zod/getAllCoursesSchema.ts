import { z } from "zod";
import { courseSchema } from "./courseSchema";

 /**
 * @description OK
 */
export const getAllCourses200Schema = z.array(z.lazy(() => courseSchema));
/**
 * @description OK
 */
export const getAllCoursesQueryResponseSchema = z.array(z.lazy(() => courseSchema));