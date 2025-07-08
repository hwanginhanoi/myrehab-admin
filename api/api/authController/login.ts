import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { LoginMutationRequest, LoginMutationResponse } from "../../types/Login";

 /**
 * @description Authenticates a user and returns a JWT token
 * @summary Authenticate user
 * @link /api/auth/login
 */
export async function login(data?: LoginMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<LoginMutationResponse>["data"]> {
    const res = await client<LoginMutationResponse, LoginMutationRequest>({ method: "post", url: `/api/auth/login`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}