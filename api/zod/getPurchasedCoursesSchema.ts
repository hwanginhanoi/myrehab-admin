import { z } from "zod";
import { courseDtoSchema } from "./courseDtoSchema";


export const getPurchasedCoursesPathParamsSchema = z.object({ "patientId": z.number().int() });
/**
 * @description OK
 */
export const getPurchasedCourses200Schema = z.array(z.lazy(() => courseDtoSchema));
/**
 * @description OK
 */
export const getPurchasedCoursesQueryResponseSchema = z.array(z.lazy(() => courseDtoSchema));