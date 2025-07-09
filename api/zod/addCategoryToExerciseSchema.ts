import { z } from "zod";


export const addCategoryToExercisePathParamsSchema = z.object({ "exerciseId": z.number().int(), "categoryId": z.number().int() });
/**
 * @description OK
 */
export const addCategoryToExercise200Schema = z.any();

 export const addCategoryToExerciseMutationResponseSchema = z.any();