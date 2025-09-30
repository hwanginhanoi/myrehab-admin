import type { PurchaseResponse } from "./PurchaseResponse";

 /**
 * @description OK
*/
export type GetMyPurchases200 = PurchaseResponse[];
/**
 * @description OK
*/
export type GetMyPurchasesQueryResponse = PurchaseResponse[];
export type GetMyPurchasesQuery = {
    Response: GetMyPurchasesQueryResponse;
};