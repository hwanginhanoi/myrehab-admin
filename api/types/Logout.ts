import type { RefreshTokenRequest } from "./RefreshTokenRequest";

 /**
 * @description OK
*/
export type Logout200 = string;
export type LogoutMutationRequest = RefreshTokenRequest;
/**
 * @description OK
*/
export type LogoutMutationResponse = string;
export type LogoutMutation = {
    Response: LogoutMutationResponse;
    Request: LogoutMutationRequest;
};