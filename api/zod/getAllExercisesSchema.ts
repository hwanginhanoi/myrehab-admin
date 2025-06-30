import { z } from "zod";
import { exerciseSchema } from "./exerciseSchema";

 /**
 * @description OK
 */
export const getAllExercises200Schema = z.array(z.lazy(() => exerciseSchema));
/**
 * @description OK
 */
export const getAllExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseSchema));