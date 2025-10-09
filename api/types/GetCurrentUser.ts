import type { UserInfoResponse } from "./UserInfoResponse";

 /**
 * @description OK
*/
export type GetCurrentUser200 = UserInfoResponse;
/**
 * @description OK
*/
export type GetCurrentUserQueryResponse = UserInfoResponse;
export type GetCurrentUserQuery = {
    Response: GetCurrentUserQueryResponse;
};