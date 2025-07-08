import { z } from "zod";


export const deletePatientPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const deletePatient200Schema = z.any();

 export const deletePatientMutationResponseSchema = z.any();