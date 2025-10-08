import type { UserBasicInfoResponse } from "./UserBasicInfoResponse";

 /**
 * @description OK
*/
export type GetMyBasicInfo200 = UserBasicInfoResponse;
/**
 * @description OK
*/
export type GetMyBasicInfoQueryResponse = UserBasicInfoResponse;
export type GetMyBasicInfoQuery = {
    Response: GetMyBasicInfoQueryResponse;
};