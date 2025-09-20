import { z } from "zod";
import { exerciseResponseSchema } from "./exerciseResponseSchema";


export const searchExercisesQueryParamsSchema = z.object({ "keyword": z.string().describe("Search keyword") });
/**
 * @description OK
 */
export const searchExercises200Schema = z.array(z.lazy(() => exerciseResponseSchema));
/**
 * @description OK
 */
export const searchExercisesQueryResponseSchema = z.array(z.lazy(() => exerciseResponseSchema));