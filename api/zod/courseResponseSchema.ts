import { categoryResponseSchema } from "./categoryResponseSchema";
import { courseDayResponseSchema } from "./courseDayResponseSchema";
import { z } from "zod";


export const courseResponseSchema = z.object({ "id": z.number().int().optional(), "title": z.string().optional(), "description": z.string().optional(), "imageUrl": z.string().optional(), "price": z.number().optional(), "durationDays": z.number().int().optional(), "category": z.lazy(() => categoryResponseSchema).optional(), "courseDays": z.array(z.lazy(() => courseDayResponseSchema)).optional(), "createdAt": z.string().datetime().optional(), "updatedAt": z.string().datetime().optional() });