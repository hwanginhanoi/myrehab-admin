import type { UserProfileResponse } from "./UserProfileResponse";

 export type GetUserProfilePathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type GetUserProfile200 = UserProfileResponse;
/**
 * @description OK
*/
export type GetUserProfileQueryResponse = UserProfileResponse;
export type GetUserProfileQuery = {
    Response: GetUserProfileQueryResponse;
    PathParams: GetUserProfilePathParams;
};