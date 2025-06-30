import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { authRequestSchema } from "./authRequestSchema";

 /**
 * @description OK
 */
export const authenticate200Schema = z.lazy(() => authResponseSchema);

 export const authenticateMutationRequestSchema = z.lazy(() => authRequestSchema);
/**
 * @description OK
 */
export const authenticateMutationResponseSchema = z.lazy(() => authResponseSchema);