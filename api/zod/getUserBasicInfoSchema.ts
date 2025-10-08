import { z } from "zod";
import { userBasicInfoResponseSchema } from "./userBasicInfoResponseSchema";


export const getUserBasicInfoPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const getUserBasicInfo200Schema = z.lazy(() => userBasicInfoResponseSchema);
/**
 * @description OK
 */
export const getUserBasicInfoQueryResponseSchema = z.lazy(() => userBasicInfoResponseSchema);