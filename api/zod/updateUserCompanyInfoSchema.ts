import { z } from "zod";
import { userCompanyInfoResponseSchema } from "./userCompanyInfoResponseSchema";
import { userCompanyInfoRequestSchema } from "./userCompanyInfoRequestSchema";


export const updateUserCompanyInfoPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const updateUserCompanyInfo200Schema = z.lazy(() => userCompanyInfoResponseSchema);

 export const updateUserCompanyInfoMutationRequestSchema = z.lazy(() => userCompanyInfoRequestSchema);
/**
 * @description OK
 */
export const updateUserCompanyInfoMutationResponseSchema = z.lazy(() => userCompanyInfoResponseSchema);