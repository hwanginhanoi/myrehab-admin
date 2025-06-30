import type { TokenRefreshResponse } from "./TokenRefreshResponse";
import type { TokenRefreshRequest } from "./TokenRefreshRequest";

 /**
 * @description OK
*/
export type RefreshToken200 = TokenRefreshResponse;
export type RefreshTokenMutationRequest = TokenRefreshRequest;
/**
 * @description OK
*/
export type RefreshTokenMutationResponse = TokenRefreshResponse;
export type RefreshTokenMutation = {
    Response: RefreshTokenMutationResponse;
    Request: RefreshTokenMutationRequest;
};