import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SendOtpForUserMutationRequest, SendOtpForUserMutationResponse } from "../../types/SendOtpForUser";

 /**
 * @description Send OTP for user login (users authenticate via OTP)
 * @summary Send OTP to user's phone
 * @link /api/auth/user/send-otp
 */
export async function sendOtpForUser(data: SendOtpForUserMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SendOtpForUserMutationResponse>["data"]> {
    const res = await client<SendOtpForUserMutationResponse, SendOtpForUserMutationRequest>({ method: "post", url: `/api/auth/user/send-otp`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}