import { z } from "zod";
import { nationalHealthInsuranceResponseSchema } from "./nationalHealthInsuranceResponseSchema";

 /**
 * @description OK
 */
export const getMyNationalHealthInsurance200Schema = z.lazy(() => nationalHealthInsuranceResponseSchema);
/**
 * @description OK
 */
export const getMyNationalHealthInsuranceQueryResponseSchema = z.lazy(() => nationalHealthInsuranceResponseSchema);