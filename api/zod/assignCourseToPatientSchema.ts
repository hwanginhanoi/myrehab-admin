import { z } from "zod";


export const assignCourseToPatientPathParamsSchema = z.object({ "patientId": z.number().int(), "courseId": z.number().int() });
/**
 * @description OK
 */
export const assignCourseToPatient200Schema = z.any();

 export const assignCourseToPatientMutationResponseSchema = z.any();