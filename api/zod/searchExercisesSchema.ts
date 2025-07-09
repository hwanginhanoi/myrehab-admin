import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";


export const searchExercisesQueryParamsSchema = z.object({ "title": z.string() });
/**
 * @description OK
 */
export const searchExercises200Schema = z.array(z.lazy(() => exerciseDtoSchema));
/**
 * @description OK
 */
export const searchExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseDtoSchema));