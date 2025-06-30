import client from "axios";
import type { ResponseConfig } from "axios";
import type { RefreshTokenMutationRequest, RefreshTokenMutationResponse } from "../../types/RefreshToken";

 /**
 * @link /api/auth/refresh
 */
export async function refreshToken(data: RefreshTokenMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RefreshTokenMutationResponse>["data"]> {
    const res = await client<RefreshTokenMutationResponse, RefreshTokenMutationRequest>({ method: "post", url: `/api/auth/refresh`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}