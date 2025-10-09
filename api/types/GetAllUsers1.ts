import type { Pageable } from "./Pageable";
import type { PageUserResponse } from "./PageUserResponse";

 export type GetAllUsers1QueryParams = {
    /**
     * @type object
    */
    pageable: Pageable;
};
/**
 * @description OK
*/
export type GetAllUsers1200 = PageUserResponse;
/**
 * @description OK
*/
export type GetAllUsers1QueryResponse = PageUserResponse;
export type GetAllUsers1Query = {
    Response: GetAllUsers1QueryResponse;
    QueryParams: GetAllUsers1QueryParams;
};