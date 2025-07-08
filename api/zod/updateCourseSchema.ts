import { z } from "zod";
import { courseSchema } from "./courseSchema";


export const updateCoursePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCourse200Schema = z.lazy(() => courseSchema);

 export const updateCourseMutationRequestSchema = z.lazy(() => courseSchema);
/**
 * @description OK
 */
export const updateCourseMutationResponseSchema = z.lazy(() => courseSchema);