import type { UserProfileResponse } from "./UserProfileResponse";

 /**
 * @description OK
*/
export type GetMyProfile200 = UserProfileResponse;
/**
 * @description OK
*/
export type GetMyProfileQueryResponse = UserProfileResponse;
export type GetMyProfileQuery = {
    Response: GetMyProfileQueryResponse;
};