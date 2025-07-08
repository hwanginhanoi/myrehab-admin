import { z } from "zod";


export const deleteCoursePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const deleteCourse200Schema = z.any();

 export const deleteCourseMutationResponseSchema = z.any();