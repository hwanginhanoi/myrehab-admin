import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";


export const getPatientByIdPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getPatientById200Schema = z.lazy(() => patientDtoSchema);
/**
 * @description OK
 */
export const getPatientByIdQueryResponseSchema = z.lazy(() => patientDtoSchema);