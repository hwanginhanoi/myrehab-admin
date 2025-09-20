import { categoryResponseSchema } from "./categoryResponseSchema";
import { z } from "zod";


export const exerciseInfoSchema = z.object({ "id": z.number().int().optional(), "title": z.string().optional(), "description": z.string().optional(), "imageUrl": z.string().optional(), "videoUrl": z.string().optional(), "durationMinutes": z.number().int().optional(), "repetitions": z.number().int().optional(), "sets": z.number().int().optional(), "price": z.number().optional(), "category": z.lazy(() => categoryResponseSchema).optional() });