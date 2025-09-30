import type { Pageable } from "./Pageable";
import type { PageUserResponse } from "./PageUserResponse";

 export type GetAllUsersPaginatedQueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type GetAllUsersPaginated200 = PageUserResponse;
/**
 * @description OK
*/
export type GetAllUsersPaginatedQueryResponse = PageUserResponse;
export type GetAllUsersPaginatedQuery = {
    Response: GetAllUsersPaginatedQueryResponse;
    QueryParams: GetAllUsersPaginatedQueryParams;
};