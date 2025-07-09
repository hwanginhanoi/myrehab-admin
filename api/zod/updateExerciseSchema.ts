import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";


export const updateExercisePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateExercise200Schema = z.lazy(() => exerciseDtoSchema);

 export const updateExerciseMutationRequestSchema = z.lazy(() => exerciseDtoSchema);
/**
 * @description OK
 */
export const updateExerciseMutationResponseSchema = z.lazy(() => exerciseDtoSchema);