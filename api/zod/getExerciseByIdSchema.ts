import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";


export const getExerciseByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getExerciseById200Schema = z.lazy(() => exerciseResponseSchema);
/**
 * @description OK
 */
export const getExerciseByIdQueryResponseSchema = z.lazy(() => exerciseResponseSchema);