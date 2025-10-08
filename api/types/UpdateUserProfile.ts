import type { UserProfileResponse } from "./UserProfileResponse";
import type { UserProfileRequest } from "./UserProfileRequest";

 export type UpdateUserProfilePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type UpdateUserProfile200 = UserProfileResponse;
export type UpdateUserProfileMutationRequest = UserProfileRequest;
/**
 * @description OK
*/
export type UpdateUserProfileMutationResponse = UserProfileResponse;
export type UpdateUserProfileMutation = {
    Response: UpdateUserProfileMutationResponse;
    Request: UpdateUserProfileMutationRequest;
    PathParams: UpdateUserProfilePathParams;
};