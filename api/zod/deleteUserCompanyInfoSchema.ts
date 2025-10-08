import { z } from "zod";


export const deleteUserCompanyInfoPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const deleteUserCompanyInfo200Schema = z.any();

 export const deleteUserCompanyInfoMutationResponseSchema = z.any();