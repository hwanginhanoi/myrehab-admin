import { z } from "zod";
import { purchaseResponseSchema } from "./purchaseResponseSchema";

 /**
 * @description OK
 */
export const getMyPurchases200Schema = z.array(z.lazy(() => purchaseResponseSchema));
/**
 * @description OK
 */
export const getMyPurchasesQueryResponseSchema = z.array(z.lazy(() => purchaseResponseSchema));