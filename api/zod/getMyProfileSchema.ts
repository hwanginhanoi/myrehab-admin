import { z } from "zod";
import { userProfileResponseSchema } from "./userProfileResponseSchema";

 /**
 * @description OK
 */
export const getMyProfile200Schema = z.lazy(() => userProfileResponseSchema);
/**
 * @description OK
 */
export const getMyProfileQueryResponseSchema = z.lazy(() => userProfileResponseSchema);