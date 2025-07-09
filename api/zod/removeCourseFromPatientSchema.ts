import { z } from "zod";


export const removeCourseFromPatientPathParamsSchema = z.object({ "patientId": z.number().int(), "courseId": z.number().int() });
/**
 * @description OK
 */
export const removeCourseFromPatient200Schema = z.any();

 export const removeCourseFromPatientMutationResponseSchema = z.any();