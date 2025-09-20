import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { loginRequestSchema } from "./loginRequestSchema";

 /**
 * @description OK
 */
export const staffLogin200Schema = z.lazy(() => authResponseSchema);

 export const staffLoginMutationRequestSchema = z.lazy(() => loginRequestSchema);
/**
 * @description OK
 */
export const staffLoginMutationResponseSchema = z.lazy(() => authResponseSchema);