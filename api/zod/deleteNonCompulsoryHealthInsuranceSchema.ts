import { z } from "zod";


export const deleteNonCompulsoryHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const deleteNonCompulsoryHealthInsurance200Schema = z.any();

 export const deleteNonCompulsoryHealthInsuranceMutationResponseSchema = z.any();