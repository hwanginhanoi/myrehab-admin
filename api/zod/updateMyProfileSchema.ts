import { z } from "zod";
import { userProfileResponseSchema } from "./userProfileResponseSchema";
import { userProfileRequestSchema } from "./userProfileRequestSchema";

 /**
 * @description OK
 */
export const updateMyProfile200Schema = z.lazy(() => userProfileResponseSchema);

 export const updateMyProfileMutationRequestSchema = z.lazy(() => userProfileRequestSchema);
/**
 * @description OK
 */
export const updateMyProfileMutationResponseSchema = z.lazy(() => userProfileResponseSchema);