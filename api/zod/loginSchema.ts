import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { authRequestSchema } from "./authRequestSchema";

 /**
 * @description OK
 */
export const login200Schema = z.lazy(() => authResponseSchema);

 export const loginMutationRequestSchema = z.lazy(() => authRequestSchema);
/**
 * @description OK
 */
export const loginMutationResponseSchema = z.lazy(() => authResponseSchema);