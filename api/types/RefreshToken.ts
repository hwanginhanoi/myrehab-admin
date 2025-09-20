import type { AuthResponse } from "./AuthResponse";
import type { RefreshTokenRequest } from "./RefreshTokenRequest";

 /**
 * @description OK
*/
export type RefreshToken200 = AuthResponse;
export type RefreshTokenMutationRequest = RefreshTokenRequest;
/**
 * @description OK
*/
export type RefreshTokenMutationResponse = AuthResponse;
export type RefreshTokenMutation = {
    Response: RefreshTokenMutationResponse;
    Request: RefreshTokenMutationRequest;
};