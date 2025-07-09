import { z } from "zod";


export const addExerciseToCoursePathParamsSchema = z.object({ "courseId": z.number().int(), "exerciseId": z.number().int() });
/**
 * @description OK
 */
export const addExerciseToCourse200Schema = z.any();

 export const addExerciseToCourseMutationResponseSchema = z.any();