import type { UserProfileResponse } from "./UserProfileResponse";
import type { UserProfileRequest } from "./UserProfileRequest";

 /**
 * @description OK
*/
export type UpdateMyProfile200 = UserProfileResponse;
export type UpdateMyProfileMutationRequest = UserProfileRequest;
/**
 * @description OK
*/
export type UpdateMyProfileMutationResponse = UserProfileResponse;
export type UpdateMyProfileMutation = {
    Response: UpdateMyProfileMutationResponse;
    Request: UpdateMyProfileMutationRequest;
};