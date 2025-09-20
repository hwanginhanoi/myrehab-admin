import { z } from "zod";
import { authResponseSchema } from "./authResponseSchema";
import { otpVerificationRequestSchema } from "./otpVerificationRequestSchema";

 /**
 * @description OK
 */
export const verifyOtpAndLogin200Schema = z.lazy(() => authResponseSchema);

 export const verifyOtpAndLoginMutationRequestSchema = z.lazy(() => otpVerificationRequestSchema);
/**
 * @description OK
 */
export const verifyOtpAndLoginMutationResponseSchema = z.lazy(() => authResponseSchema);