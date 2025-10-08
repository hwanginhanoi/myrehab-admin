import { z } from "zod";


export const deleteNationalHealthInsurancePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const deleteNationalHealthInsurance200Schema = z.any();

 export const deleteNationalHealthInsuranceMutationResponseSchema = z.any();