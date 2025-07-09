import { categoryDtoSchema } from "./categoryDtoSchema";
import { exerciseDtoSchema } from "./exerciseDtoSchema";
import { z } from "zod";


export const courseDtoSchema = z.object({ "id": z.number().int().optional(), "title": z.string().min(1), "description": z.string().optional(), "imageUrl": z.string().optional(), "price": z.number(), "categories": z.array(z.lazy(() => categoryDtoSchema)).optional(), "exercises": z.array(z.lazy(() => exerciseDtoSchema)).optional() });