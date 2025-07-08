import type { AuthResponse } from "./AuthResponse";
import type { AuthRequest } from "./AuthRequest";

 /**
 * @description OK
*/
export type Login200 = AuthResponse;
export type LoginMutationRequest = AuthRequest;
/**
 * @description OK
*/
export type LoginMutationResponse = AuthResponse;
export type LoginMutation = {
    Response: LoginMutationResponse;
    Request: LoginMutationRequest;
};