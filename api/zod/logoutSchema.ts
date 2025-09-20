import { z } from "zod";
import { refreshTokenRequestSchema } from "./refreshTokenRequestSchema";

 /**
 * @description OK
 */
export const logout200Schema = z.string();

 export const logoutMutationRequestSchema = z.lazy(() => refreshTokenRequestSchema);
/**
 * @description OK
 */
export const logoutMutationResponseSchema = z.string();