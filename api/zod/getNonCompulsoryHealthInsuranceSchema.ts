import { z } from "zod";
import { nonCompulsoryHealthInsuranceResponseSchema } from "./nonCompulsoryHealthInsuranceResponseSchema";


export const getNonCompulsoryHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const getNonCompulsoryHealthInsurance200Schema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);
/**
 * @description OK
 */
export const getNonCompulsoryHealthInsuranceQueryResponseSchema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);