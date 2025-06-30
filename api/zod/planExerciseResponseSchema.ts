import { z } from "zod";


export const planExerciseResponseSchema = z.object({ "id": z.number().int(), "name": z.string(), "description": z.string(), "instructions": z.string(), "videoUrl": z.string().optional(), "imageUrl": z.string().optional(), "sets": z.number().int().optional(), "repsPerSet": z.number().int().optional(), "durationSeconds": z.number().int().optional(), "orderIndex": z.number().int(), "cautions": z.string().optional(), "equipmentNeeded": z.string().optional() });