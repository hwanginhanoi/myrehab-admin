import { exerciseInfoSchema } from "./exerciseInfoSchema";
import { z } from "zod";


export const dayExerciseResponseSchema = z.object({ "id": z.number().int().optional(), "orderInDay": z.number().int().optional(), "customRepetitions": z.number().int().optional(), "customSets": z.number().int().optional(), "customDurationMinutes": z.number().int().optional(), "notes": z.string().optional(), "isActive": z.boolean().optional(), "exercise": z.lazy(() => exerciseInfoSchema).optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });