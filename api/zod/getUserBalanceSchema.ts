import { z } from "zod";
import { balanceResponseSchema } from "./balanceResponseSchema";

 /**
 * @description OK
 */
export const getUserBalance200Schema = z.lazy(() => balanceResponseSchema);
/**
 * @description OK
 */
export const getUserBalanceQueryResponseSchema = z.lazy(() => balanceResponseSchema);