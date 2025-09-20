import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RefreshTokenMutationRequest, RefreshTokenMutationResponse } from "../../types/RefreshToken";

 /**
 * @description Generate new access token using refresh token
 * @summary Refresh access token
 * @link /api/auth/refresh-token
 */
export async function refreshToken(data: RefreshTokenMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RefreshTokenMutationResponse>["data"]> {
    const res = await client<RefreshTokenMutationResponse, RefreshTokenMutationRequest>({ method: "post", url: `/api/auth/refresh-token`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}