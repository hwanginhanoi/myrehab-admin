import type { AuthResponse } from "./AuthResponse";
import type { AuthRequest } from "./AuthRequest";

 /**
 * @description OK
*/
export type Authenticate200 = AuthResponse;
export type AuthenticateMutationRequest = AuthRequest;
/**
 * @description OK
*/
export type AuthenticateMutationResponse = AuthResponse;
export type AuthenticateMutation = {
    Response: AuthenticateMutationResponse;
    Request: AuthenticateMutationRequest;
};