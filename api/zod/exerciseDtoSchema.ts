import { categoryDtoSchema } from "./categoryDtoSchema";
import { z } from "zod";


export const exerciseDtoSchema = z.object({ "id": z.number().int().optional(), "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().optional(), "videoUrl": z.string().optional(), "price": z.number(), "categories": z.array(z.lazy(() => categoryDtoSchema)).optional() });