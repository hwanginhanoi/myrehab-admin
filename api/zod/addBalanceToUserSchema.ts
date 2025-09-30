import { z } from "zod";
import { balanceResponseSchema } from "./balanceResponseSchema";
import { addBalanceRequestSchema } from "./addBalanceRequestSchema";


export const addBalanceToUserPathParamsSchema = z.object({ "userId": z.number().int() });
/**
 * @description OK
 */
export const addBalanceToUser200Schema = z.lazy(() => balanceResponseSchema);

 export const addBalanceToUserMutationRequestSchema = z.lazy(() => addBalanceRequestSchema);
/**
 * @description OK
 */
export const addBalanceToUserMutationResponseSchema = z.lazy(() => balanceResponseSchema);