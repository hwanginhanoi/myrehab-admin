import { z } from "zod";


export const deleteExercisePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const deleteExercise200Schema = z.any();

 export const deleteExerciseMutationResponseSchema = z.any();