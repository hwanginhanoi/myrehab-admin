import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { refreshTokenRequestSchema } from "./refreshTokenRequestSchema";

 /**
 * @description OK
 */
export const refreshToken200Schema = z.lazy(() => authResponseSchema);

 export const refreshTokenMutationRequestSchema = z.lazy(() => refreshTokenRequestSchema);
/**
 * @description OK
 */
export const refreshTokenMutationResponseSchema = z.lazy(() => authResponseSchema);