import { z } from "zod";
import { courseSchema } from "./courseSchema";

 /**
 * @description OK
 */
export const createCourse200Schema = z.lazy(() => courseSchema);

 export const createCourseMutationRequestSchema = z.lazy(() => courseSchema);
/**
 * @description OK
 */
export const createCourseMutationResponseSchema = z.lazy(() => courseSchema);