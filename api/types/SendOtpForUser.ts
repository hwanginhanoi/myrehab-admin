import type { OtpLoginRequest } from "./OtpLoginRequest";

 /**
 * @description OK
*/
export type SendOtpForUser200 = string;
export type SendOtpForUserMutationRequest = OtpLoginRequest;
/**
 * @description OK
*/
export type SendOtpForUserMutationResponse = string;
export type SendOtpForUserMutation = {
    Response: SendOtpForUserMutationResponse;
    Request: SendOtpForUserMutationRequest;
};