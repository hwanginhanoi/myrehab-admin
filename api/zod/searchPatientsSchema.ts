import { z } from "zod";
import { patientDtoSchema } from "./patientDtoSchema";


export const searchPatientsQueryParamsSchema = z.object({ "query": z.string() });
/**
 * @description OK
 */
export const searchPatients200Schema = z.array(z.lazy(() => patientDtoSchema));
/**
 * @description OK
 */
export const searchPatientsQueryResponseSchema = z.array(z.lazy(() => patientDtoSchema));