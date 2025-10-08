import { z } from "zod";
import { userProfileResponseSchema } from "./userProfileResponseSchema";


export const getUserProfilePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const getUserProfile200Schema = z.lazy(() => userProfileResponseSchema);
/**
 * @description OK
 */
export const getUserProfileQueryResponseSchema = z.lazy(() => userProfileResponseSchema);