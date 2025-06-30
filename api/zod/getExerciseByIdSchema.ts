import { z } from "zod";
import { exerciseSchema } from "./exerciseSchema";


export const getExerciseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getExerciseById200Schema = z.lazy(() => exerciseSchema);
/**
 * @description OK
 */
export const getExerciseByIdQueryResponseSchema = z.lazy(() => exerciseSchema);