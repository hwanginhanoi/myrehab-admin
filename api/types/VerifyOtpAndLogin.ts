import type { AuthResponse } from "./AuthResponse";
import type { OtpVerificationRequest } from "./OtpVerificationRequest";

 /**
 * @description OK
*/
export type VerifyOtpAndLogin200 = AuthResponse;
export type VerifyOtpAndLoginMutationRequest = OtpVerificationRequest;
/**
 * @description OK
*/
export type VerifyOtpAndLoginMutationResponse = AuthResponse;
export type VerifyOtpAndLoginMutation = {
    Response: VerifyOtpAndLoginMutationResponse;
    Request: VerifyOtpAndLoginMutationRequest;
};