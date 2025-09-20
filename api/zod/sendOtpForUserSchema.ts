import { z } from "zod";
import { otpLoginRequestSchema } from "./otpLoginRequestSchema";

 /**
 * @description OK
 */
export const sendOtpForUser200Schema = z.string();

 export const sendOtpForUserMutationRequestSchema = z.lazy(() => otpLoginRequestSchema);
/**
 * @description OK
 */
export const sendOtpForUserMutationResponseSchema = z.string();