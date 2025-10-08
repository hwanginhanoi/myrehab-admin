import type { UserBasicInfoResponse } from "./UserBasicInfoResponse";

 export type GetUserBasicInfoPathParams = {
    /**
     * @type integer, int64
    */
    userId: number;
};
/**
 * @description OK
*/
export type GetUserBasicInfo200 = UserBasicInfoResponse;
/**
 * @description OK
*/
export type GetUserBasicInfoQueryResponse = UserBasicInfoResponse;
export type GetUserBasicInfoQuery = {
    Response: GetUserBasicInfoQueryResponse;
    PathParams: GetUserBasicInfoPathParams;
};