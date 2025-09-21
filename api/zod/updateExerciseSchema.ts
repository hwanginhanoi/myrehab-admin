import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";
import { updateExerciseRequestSchema } from "./updateExerciseRequestSchema";


export const updateExercisePathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updateExercise200Schema = z.lazy(() => exerciseResponseSchema);

 export const updateExerciseMutationRequestSchema = z.lazy(() => updateExerciseRequestSchema);
/**
 * @description OK
 */
export const updateExerciseMutationResponseSchema = z.lazy(() => exerciseResponseSchema);