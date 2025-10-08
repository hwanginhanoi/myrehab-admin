import type { UserCompanyInfoResponse } from "./UserCompanyInfoResponse";
import type { UserCompanyInfoRequest } from "./UserCompanyInfoRequest";

 /**
 * @description OK
*/
export type UpdateMyCompanyInfo200 = UserCompanyInfoResponse;
export type UpdateMyCompanyInfoMutationRequest = UserCompanyInfoRequest;
/**
 * @description OK
*/
export type UpdateMyCompanyInfoMutationResponse = UserCompanyInfoResponse;
export type UpdateMyCompanyInfoMutation = {
    Response: UpdateMyCompanyInfoMutationResponse;
    Request: UpdateMyCompanyInfoMutationRequest;
};