import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";


export const removeCourseFromPatientPathParamsSchema = z.object({ "patientId": z.number().int(), "courseId": z.number().int() });
/**
 * @description OK
 */
export const removeCourseFromPatient200Schema = z.lazy(() => patientDtoSchema);
/**
 * @description OK
 */
export const removeCourseFromPatientMutationResponseSchema = z.lazy(() => patientDtoSchema);