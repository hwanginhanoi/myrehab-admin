import client from "axios";
import type { ResponseConfig } from "axios";
import type { RegisterMutationRequest, RegisterMutationResponse } from "../../types/Register";

 /**
 * @description Endpoint for user registration
 * @summary User Registration
 * @link /api/auth/register
 */
export async function register(data: RegisterMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RegisterMutationResponse>["data"]> {
    const res = await client<RegisterMutationResponse, RegisterMutationRequest>({ method: "post", url: `/api/auth/register`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}