import type { UserBasicInfoResponse } from "./UserBasicInfoResponse";
import type { UserBasicInfoRequest } from "./UserBasicInfoRequest";

 /**
 * @description OK
*/
export type UpdateMyBasicInfo200 = UserBasicInfoResponse;
export type UpdateMyBasicInfoMutationRequest = UserBasicInfoRequest;
/**
 * @description OK
*/
export type UpdateMyBasicInfoMutationResponse = UserBasicInfoResponse;
export type UpdateMyBasicInfoMutation = {
    Response: UpdateMyBasicInfoMutationResponse;
    Request: UpdateMyBasicInfoMutationRequest;
};