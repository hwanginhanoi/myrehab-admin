import { z } from "zod";
import { exerciseSchema } from "./exerciseSchema";
import { exerciseCreateRequestSchema } from "./exerciseCreateRequestSchema";

 /**
 * @description OK
 */
export const createExercise200Schema = z.lazy(() => exerciseSchema);

 export const createExerciseMutationRequestSchema = z.lazy(() => exerciseCreateRequestSchema);
/**
 * @description OK
 */
export const createExerciseMutationResponseSchema = z.lazy(() => exerciseSchema);