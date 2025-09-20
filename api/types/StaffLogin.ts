import type { AuthResponse } from "./AuthResponse";
import type { LoginRequest } from "./LoginRequest";

 /**
 * @description OK
*/
export type StaffLogin200 = AuthResponse;
export type StaffLoginMutationRequest = LoginRequest;
/**
 * @description OK
*/
export type StaffLoginMutationResponse = AuthResponse;
export type StaffLoginMutation = {
    Response: StaffLoginMutationResponse;
    Request: StaffLoginMutationRequest;
};