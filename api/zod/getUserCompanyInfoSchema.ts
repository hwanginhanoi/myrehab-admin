import { z } from "zod";
import { userCompanyInfoResponseSchema } from "./userCompanyInfoResponseSchema";


export const getUserCompanyInfoPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const getUserCompanyInfo200Schema = z.lazy(() => userCompanyInfoResponseSchema);
/**
 * @description OK
 */
export const getUserCompanyInfoQueryResponseSchema = z.lazy(() => userCompanyInfoResponseSchema);