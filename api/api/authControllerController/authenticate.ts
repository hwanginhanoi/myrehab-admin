import client from "axios";
import type { ResponseConfig } from "axios";
import type { AuthenticateMutationRequest, AuthenticateMutationResponse } from "../../types/Authenticate";

 /**
 * @description Endpoint for user authentication
 * @summary User Authentication
 * @link /api/auth/login
 */
export async function authenticate(data: AuthenticateMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AuthenticateMutationResponse>["data"]> {
    const res = await client<AuthenticateMutationResponse, AuthenticateMutationRequest>({ method: "post", url: `/api/auth/login`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}