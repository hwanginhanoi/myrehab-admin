import type { BalanceResponse } from "./BalanceResponse";

 /**
 * @description OK
*/
export type GetUserBalance200 = BalanceResponse;
/**
 * @description OK
*/
export type GetUserBalanceQueryResponse = BalanceResponse;
export type GetUserBalanceQuery = {
    Response: GetUserBalanceQueryResponse;
};