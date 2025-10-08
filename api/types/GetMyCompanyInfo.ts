import type { UserCompanyInfoResponse } from "./UserCompanyInfoResponse";

 /**
 * @description OK
*/
export type GetMyCompanyInfo200 = UserCompanyInfoResponse;
/**
 * @description OK
*/
export type GetMyCompanyInfoQueryResponse = UserCompanyInfoResponse;
export type GetMyCompanyInfoQuery = {
    Response: GetMyCompanyInfoQueryResponse;
};