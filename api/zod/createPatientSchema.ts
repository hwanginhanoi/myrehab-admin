import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";

 /**
 * @description OK
 */
export const createPatient200Schema = z.lazy(() => patientDtoSchema);

 export const createPatientMutationRequestSchema = z.lazy(() => patientDtoSchema);
/**
 * @description OK
 */
export const createPatientMutationResponseSchema = z.lazy(() => patientDtoSchema);