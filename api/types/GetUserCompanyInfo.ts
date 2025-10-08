import type { UserCompanyInfoResponse } from "./UserCompanyInfoResponse";

 export type GetUserCompanyInfoPathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type GetUserCompanyInfo200 = UserCompanyInfoResponse;
/**
 * @description OK
*/
export type GetUserCompanyInfoQueryResponse = UserCompanyInfoResponse;
export type GetUserCompanyInfoQuery = {
    Response: GetUserCompanyInfoQueryResponse;
    PathParams: GetUserCompanyInfoPathParams;
};