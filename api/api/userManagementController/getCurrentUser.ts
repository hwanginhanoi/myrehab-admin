import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCurrentUserQueryResponse } from "../../types/GetCurrentUser";

 /**
 * @description Returns current authenticated user's information including role and permissions
 * @summary Get current user info
 * @link /api/users/me
 */
export async function getCurrentUser(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCurrentUserQueryResponse>["data"]> {
    const res = await client<GetCurrentUserQueryResponse>({ method: "get", url: `/api/users/me`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}