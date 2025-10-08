import { z } from "zod";
import { nationalHealthInsuranceResponseSchema } from "./nationalHealthInsuranceResponseSchema";


export const getNationalHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const getNationalHealthInsurance200Schema = z.lazy(() => nationalHealthInsuranceResponseSchema);
/**
 * @description OK
 */
export const getNationalHealthInsuranceQueryResponseSchema = z.lazy(() => nationalHealthInsuranceResponseSchema);