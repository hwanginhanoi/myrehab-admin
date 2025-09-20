import { z } from "zod";


export const createDayExerciseRequestSchema = z.object({ "exerciseId": z.number().int(), "orderInDay": z.number().int(), "customRepetitions": z.number().int().optional(), "customSets": z.number().int().optional(), "customDurationMinutes": z.number().int().optional(), "notes": z.string().optional() });