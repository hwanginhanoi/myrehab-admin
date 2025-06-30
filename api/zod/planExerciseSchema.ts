import { planSchema } from "./planSchema";
import { exerciseSchema } from "./exerciseSchema";
import { z } from "zod";


export const planExerciseSchema = z.object({ "id": z.number().int(), "plan": z.lazy(() => planSchema), "exercise": z.lazy(() => exerciseSchema), "orderIndex": z.number().int(), "sets": z.number().int().optional(), "repsPerSet": z.number().int().optional(), "durationSeconds": z.number().int().optional(), "restBetweenSetsSeconds": z.number().int().optional(), "notes": z.string().optional() });