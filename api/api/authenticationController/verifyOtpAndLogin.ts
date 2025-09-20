import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { VerifyOtpAndLoginMutationRequest, VerifyOtpAndLoginMutationResponse } from "../../types/VerifyOtpAndLogin";

 /**
 * @description Verify OTP code and authenticate user
 * @summary Verify OTP and login
 * @link /api/auth/user/verify-otp
 */
export async function verifyOtpAndLogin(data: VerifyOtpAndLoginMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<VerifyOtpAndLoginMutationResponse>["data"]> {
    const res = await client<VerifyOtpAndLoginMutationResponse, VerifyOtpAndLoginMutationRequest>({ method: "post", url: `/api/auth/user/verify-otp`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}