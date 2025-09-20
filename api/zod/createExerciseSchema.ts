import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";
import { createExerciseRequestSchema } from "./createExerciseRequestSchema";

 /**
 * @description OK
 */
export const createExercise200Schema = z.lazy(() => exerciseResponseSchema);

 export const createExerciseMutationRequestSchema = z.lazy(() => createExerciseRequestSchema);
/**
 * @description OK
 */
export const createExerciseMutationResponseSchema = z.lazy(() => exerciseResponseSchema);