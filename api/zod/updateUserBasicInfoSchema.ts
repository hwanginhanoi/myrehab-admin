import { z } from "zod";
import { userBasicInfoResponseSchema } from "./userBasicInfoResponseSchema";
import { userBasicInfoRequestSchema } from "./userBasicInfoRequestSchema";


export const updateUserBasicInfoPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const updateUserBasicInfo200Schema = z.lazy(() => userBasicInfoResponseSchema);

 export const updateUserBasicInfoMutationRequestSchema = z.lazy(() => userBasicInfoRequestSchema);
/**
 * @description OK
 */
export const updateUserBasicInfoMutationResponseSchema = z.lazy(() => userBasicInfoResponseSchema);