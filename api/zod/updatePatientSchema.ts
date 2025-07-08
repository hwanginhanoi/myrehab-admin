import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";


export const updatePatientPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const updatePatient200Schema = z.lazy(() => patientDtoSchema);

 export const updatePatientMutationRequestSchema = z.lazy(() => patientDtoSchema);
/**
 * @description OK
 */
export const updatePatientMutationResponseSchema = z.lazy(() => patientDtoSchema);