import { z } from "zod";
import { transactionResponseSchema } from "./transactionResponseSchema";

 /**
 * @description OK
 */
export const getTransactionHistory200Schema = z.array(z.lazy(() => transactionResponseSchema));
/**
 * @description OK
 */
export const getTransactionHistoryQueryResponseSchema = z.array(z.lazy(() => transactionResponseSchema));