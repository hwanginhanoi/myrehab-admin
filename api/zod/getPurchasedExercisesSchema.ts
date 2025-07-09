import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";


export const getPurchasedExercisesPathParamsSchema = z.object({ "patientId": z.number().int() });
/**
 * @description OK
 */
export const getPurchasedExercises200Schema = z.array(z.lazy(() => exerciseDtoSchema));
/**
 * @description OK
 */
export const getPurchasedExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseDtoSchema));