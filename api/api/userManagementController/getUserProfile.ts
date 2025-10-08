import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetUserProfileQueryResponse, GetUserProfilePathParams } from "../../types/GetUserProfile";

 /**
 * @description Admin can retrieve any user's profile information
 * @summary [Admin] Get user profile
 * @link /api/users/:userId/profile
 */
export async function getUserProfile(userId: GetUserProfilePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUserProfileQueryResponse>["data"]> {
    const res = await client<GetUserProfileQueryResponse>({ method: "get", url: `/api/users/${userId}/profile`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}