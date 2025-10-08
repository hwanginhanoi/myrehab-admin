import type { UserCompanyInfoResponse } from "./UserCompanyInfoResponse";
import type { UserCompanyInfoRequest } from "./UserCompanyInfoRequest";

 export type UpdateUserCompanyInfoPathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type UpdateUserCompanyInfo200 = UserCompanyInfoResponse;
export type UpdateUserCompanyInfoMutationRequest = UserCompanyInfoRequest;
/**
 * @description OK
*/
export type UpdateUserCompanyInfoMutationResponse = UserCompanyInfoResponse;
export type UpdateUserCompanyInfoMutation = {
    Response: UpdateUserCompanyInfoMutationResponse;
    Request: UpdateUserCompanyInfoMutationRequest;
    PathParams: UpdateUserCompanyInfoPathParams;
};