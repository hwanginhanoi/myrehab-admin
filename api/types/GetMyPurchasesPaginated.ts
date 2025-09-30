import type { Pageable } from "./Pageable";
import type { PagePurchaseResponse } from "./PagePurchaseResponse";

 export type GetMyPurchasesPaginatedQueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type GetMyPurchasesPaginated200 = PagePurchaseResponse;
/**
 * @description OK
*/
export type GetMyPurchasesPaginatedQueryResponse = PagePurchaseResponse;
export type GetMyPurchasesPaginatedQuery = {
    Response: GetMyPurchasesPaginatedQueryResponse;
    QueryParams: GetMyPurchasesPaginatedQueryParams;
};