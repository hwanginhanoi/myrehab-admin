import { z } from "zod";
import { nonCompulsoryHealthInsuranceResponseSchema } from "./nonCompulsoryHealthInsuranceResponseSchema";
import { nonCompulsoryHealthInsuranceRequestSchema } from "./nonCompulsoryHealthInsuranceRequestSchema";

 /**
 * @description OK
 */
export const updateMyNonCompulsoryHealthInsurance200Schema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);

 export const updateMyNonCompulsoryHealthInsuranceMutationRequestSchema = z.lazy(() => nonCompulsoryHealthInsuranceRequestSchema);
/**
 * @description OK
 */
export const updateMyNonCompulsoryHealthInsuranceMutationResponseSchema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);