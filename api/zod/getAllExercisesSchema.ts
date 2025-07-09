import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";

 /**
 * @description OK
 */
export const getAllExercises200Schema = z.array(z.lazy(() => exerciseDtoSchema));
/**
 * @description OK
 */
export const getAllExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseDtoSchema));