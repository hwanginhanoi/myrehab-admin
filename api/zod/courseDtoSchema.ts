import { exerciseDtoSchema } from "./exerciseDtoSchema";
import { categoryDtoSchema } from "./categoryDtoSchema";
import { z } from "zod";


export const courseDtoSchema = z.object({ "id": z.number().int().optional(), "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().optional(), "price": z.number(), "exercises": z.array(z.lazy(() => exerciseDtoSchema)).optional(), "categories": z.array(z.lazy(() => categoryDtoSchema)).optional() });