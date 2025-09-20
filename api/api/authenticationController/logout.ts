import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { LogoutMutationRequest, LogoutMutationResponse } from "../../types/Logout";

 /**
 * @description Revoke refresh token and logout user
 * @summary Logout user
 * @link /api/auth/logout
 */
export async function logout(data: LogoutMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<LogoutMutationResponse>["data"]> {
    const res = await client<LogoutMutationResponse, LogoutMutationRequest>({ method: "post", url: `/api/auth/logout`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}