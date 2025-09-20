import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";

 /**
 * @description OK
 */
export const getAllExercises200Schema = z.array(z.lazy(() => exerciseResponseSchema));
/**
 * @description OK
 */
export const getAllExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseResponseSchema));