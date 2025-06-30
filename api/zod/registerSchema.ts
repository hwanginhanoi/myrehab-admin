import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { registerRequestSchema } from "./registerRequestSchema";

 /**
 * @description OK
 */
export const register200Schema = z.lazy(() => authResponseSchema);

 export const registerMutationRequestSchema = z.lazy(() => registerRequestSchema);
/**
 * @description OK
 */
export const registerMutationResponseSchema = z.lazy(() => authResponseSchema);