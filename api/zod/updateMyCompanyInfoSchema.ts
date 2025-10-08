import { z } from "zod";
import { userCompanyInfoResponseSchema } from "./userCompanyInfoResponseSchema";
import { userCompanyInfoRequestSchema } from "./userCompanyInfoRequestSchema";

 /**
 * @description OK
 */
export const updateMyCompanyInfo200Schema = z.lazy(() => userCompanyInfoResponseSchema);

 export const updateMyCompanyInfoMutationRequestSchema = z.lazy(() => userCompanyInfoRequestSchema);
/**
 * @description OK
 */
export const updateMyCompanyInfoMutationResponseSchema = z.lazy(() => userCompanyInfoResponseSchema);