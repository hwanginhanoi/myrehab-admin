import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";


export const getExercisesByCategoryPathParamsSchema = z.object({ "categoryId": z.number().int() });
/**
 * @description OK
 */
export const getExercisesByCategory200Schema = z.array(z.lazy(() => exerciseResponseSchema));
/**
 * @description OK
 */
export const getExercisesByCategoryQueryResponseSchema = z.array(z.lazy(() => exerciseResponseSchema));