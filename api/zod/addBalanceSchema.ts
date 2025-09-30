import { z } from "zod";
import { balanceResponseSchema } from "./balanceResponseSchema";
import { addBalanceRequestSchema } from "./addBalanceRequestSchema";

 /**
 * @description OK
 */
export const addBalance200Schema = z.lazy(() => balanceResponseSchema);

 export const addBalanceMutationRequestSchema = z.lazy(() => addBalanceRequestSchema);
/**
 * @description OK
 */
export const addBalanceMutationResponseSchema = z.lazy(() => balanceResponseSchema);