import { z } from "zod";
import { nationalHealthInsuranceResponseSchema } from "./nationalHealthInsuranceResponseSchema";
import { nationalHealthInsuranceRequestSchema } from "./nationalHealthInsuranceRequestSchema";


export const updateNationalHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const updateNationalHealthInsurance200Schema = z.lazy(() => nationalHealthInsuranceResponseSchema);

 export const updateNationalHealthInsuranceMutationRequestSchema = z.lazy(() => nationalHealthInsuranceRequestSchema);
/**
 * @description OK
 */
export const updateNationalHealthInsuranceMutationResponseSchema = z.lazy(() => nationalHealthInsuranceResponseSchema);