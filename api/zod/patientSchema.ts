import { courseSchema } from "./courseSchema";
import { exerciseSchema } from "./exerciseSchema";
import { grantedAuthoritySchema } from "./grantedAuthoritySchema";
import { z } from "zod";


export const patientSchema = z.object({ "id": z.number().int().optional(), "email": z.string().optional(), "password": z.string().optional(), "firstName": z.string().optional(), "lastName": z.string().optional(), "role": z.enum(["ADMIN", "DOCTOR", "PATIENT"]).optional(), "enabled": z.boolean().optional(), "assignedCourses": z.array(z.lazy(() => courseSchema)).optional(), "purchasedCourses": z.array(z.lazy(() => courseSchema)).optional(), "purchasedExercises": z.array(z.lazy(() => exerciseSchema)).optional(), "accountNonExpired": z.boolean().optional(), "accountNonLocked": z.boolean().optional(), "authorities": z.array(z.lazy(() => grantedAuthoritySchema)).optional(), "username": z.string().optional(), "credentialsNonExpired": z.boolean().optional() });