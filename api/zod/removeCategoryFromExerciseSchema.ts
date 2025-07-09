import { z } from "zod";


export const removeCategoryFromExercisePathParamsSchema = z.object({ "exerciseId": z.number().int(), "categoryId": z.number().int() });
/**
 * @description OK
 */
export const removeCategoryFromExercise200Schema = z.any();

 export const removeCategoryFromExerciseMutationResponseSchema = z.any();