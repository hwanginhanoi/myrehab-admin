import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateUserProfileMutationRequest, UpdateUserProfileMutationResponse, UpdateUserProfilePathParams } from "../../types/UpdateUserProfile";

 /**
 * @description Admin can create or update any user's profile information
 * @summary [Admin] Update user profile
 * @link /api/users/:userId/profile
 */
export async function updateUserProfile(userId: UpdateUserProfilePathParams["userId"], data?: UpdateUserProfileMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateUserProfileMutationResponse>["data"]> {
    const res = await client<UpdateUserProfileMutationResponse, UpdateUserProfileMutationRequest>({ method: "put", url: `/api/users/${userId}/profile`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}