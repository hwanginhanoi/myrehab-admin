import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const getAssignedCoursesPathParamsSchema = z.object({ "patientId": z.number().int() });
/**
 * @description OK
 */
export const getAssignedCourses200Schema = z.array(z.lazy(() => courseDtoSchema));
/**
 * @description OK
 */
export const getAssignedCoursesQueryResponseSchema = z.array(z.lazy(() => courseDtoSchema));