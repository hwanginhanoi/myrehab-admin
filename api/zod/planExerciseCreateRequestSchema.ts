import { z } from "zod";


export const planExerciseCreateRequestSchema = z.object({ "exerciseId": z.number().int(), "orderIndex": z.number().int(), "sets": z.number().int().optional(), "repsPerSet": z.number().int().optional(), "durationSeconds": z.number().int().optional() });