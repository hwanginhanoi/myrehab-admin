import type { TransactionResponse } from "./TransactionResponse";

 /**
 * @description OK
*/
export type GetTransactionHistory200 = TransactionResponse[];
/**
 * @description OK
*/
export type GetTransactionHistoryQueryResponse = TransactionResponse[];
export type GetTransactionHistoryQuery = {
    Response: GetTransactionHistoryQueryResponse;
};