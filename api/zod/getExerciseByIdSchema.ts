import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";


export const getExerciseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getExerciseById200Schema = z.lazy(() => exerciseDtoSchema);
/**
 * @description OK
 */
export const getExerciseByIdQueryResponseSchema = z.lazy(() => exerciseDtoSchema);