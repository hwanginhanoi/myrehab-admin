import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const updateCoursePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateCourse200Schema = z.lazy(() => courseDtoSchema);

 export const updateCourseMutationRequestSchema = z.lazy(() => courseDtoSchema);
/**
 * @description OK
 */
export const updateCourseMutationResponseSchema = z.lazy(() => courseDtoSchema);