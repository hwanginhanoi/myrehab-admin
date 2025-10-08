import { z } from "zod";
import { userProfileResponseSchema } from "./userProfileResponseSchema";
import { userProfileRequestSchema } from "./userProfileRequestSchema";


export const updateUserProfilePathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const updateUserProfile200Schema = z.lazy(() => userProfileResponseSchema);

 export const updateUserProfileMutationRequestSchema = z.lazy(() => userProfileRequestSchema);
/**
 * @description OK
 */
export const updateUserProfileMutationResponseSchema = z.lazy(() => userProfileResponseSchema);