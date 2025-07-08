import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";

 /**
 * @description OK
 */
export const getAllPatients200Schema = z.array(z.lazy(() => patientDtoSchema));
/**
 * @description OK
 */
export const getAllPatientsQueryResponseSchema = z.array(z.lazy(() => patientDtoSchema));