import { z } from "zod";
import { tokenRefreshResponseSchema } from "./tokenRefreshResponseSchema";
import { tokenRefreshRequestSchema } from "./tokenRefreshRequestSchema";

 /**
 * @description OK
 */
export const refreshToken200Schema = z.lazy(() => tokenRefreshResponseSchema);

 export const refreshTokenMutationRequestSchema = z.lazy(() => tokenRefreshRequestSchema);
/**
 * @description OK
 */
export const refreshTokenMutationResponseSchema = z.lazy(() => tokenRefreshResponseSchema);