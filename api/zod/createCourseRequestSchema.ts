import { createCourseDayRequestSchema } from "./createCourseDayRequestSchema";
import { z } from "zod";


export const createCourseRequestSchema = z.object({ "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().optional(), "price": z.number(), "durationDays": z.number().int(), "categoryId": z.number().int().optional(), "courseDays": z.array(z.lazy(() => createCourseDayRequestSchema)).min(1) });