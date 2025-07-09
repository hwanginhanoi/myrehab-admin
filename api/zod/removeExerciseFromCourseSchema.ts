import { z } from "zod";


export const removeExerciseFromCoursePathParamsSchema = z.object({ "courseId": z.number().int(), "exerciseId": z.number().int() });
/**
 * @description OK
 */
export const removeExerciseFromCourse200Schema = z.any();

 export const removeExerciseFromCourseMutationResponseSchema = z.any();