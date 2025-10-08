import type { UserBasicInfoResponse } from "./UserBasicInfoResponse";
import type { UserBasicInfoRequest } from "./UserBasicInfoRequest";

 export type UpdateUserBasicInfoPathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type UpdateUserBasicInfo200 = UserBasicInfoResponse;
export type UpdateUserBasicInfoMutationRequest = UserBasicInfoRequest;
/**
 * @description OK
*/
export type UpdateUserBasicInfoMutationResponse = UserBasicInfoResponse;
export type UpdateUserBasicInfoMutation = {
    Response: UpdateUserBasicInfoMutationResponse;
    Request: UpdateUserBasicInfoMutationRequest;
    PathParams: UpdateUserBasicInfoPathParams;
};