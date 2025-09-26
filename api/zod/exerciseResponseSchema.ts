import { categoryResponseSchema } from "./categoryResponseSchema";
import { z } from "zod";


export const exerciseResponseSchema = z.object({ "id": z.number().int().optional(), "title": z.string().optional(), "description": z.string().optional(), "imageUrl": z.string().optional(), "videoUrl": z.string().optional(), "durationMinutes": z.number().int().optional(), "price": z.number().optional(), "category": z.lazy(() => categoryResponseSchema).optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });