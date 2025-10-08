import { z } from "zod";
import { nonCompulsoryHealthInsuranceResponseSchema } from "./nonCompulsoryHealthInsuranceResponseSchema";
import { nonCompulsoryHealthInsuranceRequestSchema } from "./nonCompulsoryHealthInsuranceRequestSchema";


export const updateNonCompulsoryHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const updateNonCompulsoryHealthInsurance200Schema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);

 export const updateNonCompulsoryHealthInsuranceMutationRequestSchema = z.lazy(() => nonCompulsoryHealthInsuranceRequestSchema);
/**
 * @description OK
 */
export const updateNonCompulsoryHealthInsuranceMutationResponseSchema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);