import { z } from "zod";
import { courseResponseSchema } from "./courseResponseSchema";
import { createCourseRequestSchema } from "./createCourseRequestSchema";

 /**
 * @description OK
 */
export const createCourse200Schema = z.lazy(() => courseResponseSchema);

 export const createCourseMutationRequestSchema = z.lazy(() => createCourseRequestSchema);
/**
 * @description OK
 */
export const createCourseMutationResponseSchema = z.lazy(() => courseResponseSchema);