import { z } from "zod";
import { nonCompulsoryHealthInsuranceResponseSchema } from "./nonCompulsoryHealthInsuranceResponseSchema";

 /**
 * @description OK
 */
export const getMyNonCompulsoryHealthInsurance200Schema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);
/**
 * @description OK
 */
export const getMyNonCompulsoryHealthInsuranceQueryResponseSchema = z.lazy(() => nonCompulsoryHealthInsuranceResponseSchema);