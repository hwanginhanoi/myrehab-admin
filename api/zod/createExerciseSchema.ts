import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";

 /**
 * @description OK
 */
export const createExercise200Schema = z.lazy(() => exerciseDtoSchema);

 export const createExerciseMutationRequestSchema = z.lazy(() => exerciseDtoSchema);
/**
 * @description OK
 */
export const createExerciseMutationResponseSchema = z.lazy(() => exerciseDtoSchema);