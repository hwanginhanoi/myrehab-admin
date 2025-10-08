import { z } from "zod";
import { nationalHealthInsuranceResponseSchema } from "./nationalHealthInsuranceResponseSchema";
import { nationalHealthInsuranceRequestSchema } from "./nationalHealthInsuranceRequestSchema";

 /**
 * @description OK
 */
export const updateMyNationalHealthInsurance200Schema = z.lazy(() => nationalHealthInsuranceResponseSchema);

 export const updateMyNationalHealthInsuranceMutationRequestSchema = z.lazy(() => nationalHealthInsuranceRequestSchema);
/**
 * @description OK
 */
export const updateMyNationalHealthInsuranceMutationResponseSchema = z.lazy(() => nationalHealthInsuranceResponseSchema);