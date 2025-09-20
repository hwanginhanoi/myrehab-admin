import { dayExerciseResponseSchema } from "./dayExerciseResponseSchema";
import { z } from "zod";


export const courseDayResponseSchema = z.object({ "id": z.number().int().optional(), "dayNumber": z.number().int().optional(), "dayDescription": z.string().optional(), "isActive": z.boolean().optional(), "dayExercises": z.array(z.lazy(() => dayExerciseResponseSchema)).optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });