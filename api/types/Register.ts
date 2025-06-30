import type { AuthResponse } from "./AuthResponse";
import type { RegisterRequest } from "./RegisterRequest";

 /**
 * @description OK
*/
export type Register200 = AuthResponse;
export type RegisterMutationRequest = RegisterRequest;
/**
 * @description OK
*/
export type RegisterMutationResponse = AuthResponse;
export type RegisterMutation = {
    Response: RegisterMutationResponse;
    Request: RegisterMutationRequest;
};