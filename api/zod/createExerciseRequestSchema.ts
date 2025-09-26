import { z } from "zod";


export const createExerciseRequestSchema = z.object({ "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().min(1), "videoUrl": z.string().min(1), "durationMinutes": z.number().int(), "price": z.number(), "categoryId": z.number().int().optional() });