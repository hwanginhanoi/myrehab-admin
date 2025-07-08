import { courseDtoSchema } from "./courseDtoSchema";
import { exerciseDtoSchema } from "./exerciseDtoSchema";
import { z } from "zod";


export const patientDtoSchema = z.object({ "id": z.number().int().optional(), "firstName": z.string().min(2).max(50), "lastName": z.string().min(2).max(50), "email": z.string().min(1), "password": z.string().min(8).max(2147483647).optional(), "enabled": z.boolean().optional(), "assignedCourses": z.array(z.lazy(() => courseDtoSchema)).optional(), "purchasedCourses": z.array(z.lazy(() => courseDtoSchema)).optional(), "purchasedExercises": z.array(z.lazy(() => exerciseDtoSchema)).optional() });