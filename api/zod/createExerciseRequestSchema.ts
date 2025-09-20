import { z } from "zod";


export const createExerciseRequestSchema = z.object({ "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().optional(), "videoUrl": z.string().min(1), "durationMinutes": z.number().int(), "repetitions": z.number().int(), "sets": z.number().int(), "price": z.number(), "categoryId": z.number().int().optional() });