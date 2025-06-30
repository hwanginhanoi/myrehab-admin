import { z } from "zod";
import { patientInfoResponseSchema } from "./patientInfoResponseSchema";


export const getPatientInfoPathParamsSchema = z.object({ "id": z.number().int() });
/**
 * @description OK
 */
export const getPatientInfo200Schema = z.lazy(() => patientInfoResponseSchema);
/**
 * @description OK
 */
export const getPatientInfoQueryResponseSchema = z.lazy(() => patientInfoResponseSchema);