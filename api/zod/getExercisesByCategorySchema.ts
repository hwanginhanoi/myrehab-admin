import { z } from "zod";
import { exerciseDtoSchema } from "./exerciseDtoSchema";


export const getExercisesByCategoryPathParamsSchema = z.object({ "categoryId": z.number().int() });
/**
 * @description OK
 */
export const getExercisesByCategory200Schema = z.array(z.lazy(() => exerciseDtoSchema));
/**
 * @description OK
 */
export const getExercisesByCategoryQueryResponseSchema = z.array(z.lazy(() => exerciseDtoSchema));