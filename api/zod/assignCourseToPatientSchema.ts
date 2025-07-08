import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";


export const assignCourseToPatientPathParamsSchema = z.object({ "patientId": z.number().int(), "courseId": z.number().int() });
/**
 * @description OK
 */
export const assignCourseToPatient200Schema = z.lazy(() => patientDtoSchema);
/**
 * @description OK
 */
export const assignCourseToPatientMutationResponseSchema = z.lazy(() => patientDtoSchema);