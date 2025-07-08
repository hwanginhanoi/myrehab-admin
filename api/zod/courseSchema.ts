import { exerciseSchema } from "./exerciseSchema";
import { categorySchema } from "./categorySchema";
import { patientSchema } from "./patientSchema";
import { z } from "zod";


export const courseSchema = z.object({ "id": z.number().int().optional(), "title": z.string().optional(), "description": z.string().optional(), "imageUrl": z.string().optional(), "price": z.number().optional(), "exercises": z.array(z.lazy(() => exerciseSchema)).optional(), "categories": z.array(z.lazy(() => categorySchema)).optional(), "assignedPatients": z.array(z.lazy(() => patientSchema)).optional(), "purchasingPatients": z.array(z.lazy(() => patientSchema)).optional() });