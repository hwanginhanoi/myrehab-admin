import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyProfileQueryResponse } from "../../types/GetMyProfile";

 /**
 * @description Retrieve your own profile information
 * @summary Get my profile
 * @link /api/users/api/users/me/profile
 */
export async function getMyProfile(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyProfileQueryResponse>["data"]> {
    const res = await client<GetMyProfileQueryResponse>({ method: "get", url: `/api/users/api/users/me/profile`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}