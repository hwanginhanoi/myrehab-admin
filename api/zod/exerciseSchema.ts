import { courseSchema } from "./courseSchema";
import { categorySchema } from "./categorySchema";
import { patientSchema } from "./patientSchema";
import { z } from "zod";


export const exerciseSchema = z.object({ "id": z.number().int().optional(), "title": z.string().optional(), "description": z.string().optional(), "imageUrl": z.string().optional(), "videoUrl": z.string().optional(), "price": z.number().optional(), "courses": z.array(z.lazy(() => courseSchema)).optional(), "categories": z.array(z.lazy(() => categorySchema)).optional(), "purchasingPatients": z.array(z.lazy(() => patientSchema)).optional() });