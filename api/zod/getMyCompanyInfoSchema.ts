import { z } from "zod";
import { userCompanyInfoResponseSchema } from "./userCompanyInfoResponseSchema";

 /**
 * @description OK
 */
export const getMyCompanyInfo200Schema = z.lazy(() => userCompanyInfoResponseSchema);
/**
 * @description OK
 */
export const getMyCompanyInfoQueryResponseSchema = z.lazy(() => userCompanyInfoResponseSchema);