import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteUserProfileMutationResponse, DeleteUserProfilePathParams } from "../../types/DeleteUserProfile";

 /**
 * @description Admin can delete any user's profile information
 * @summary [Admin] Delete user profile
 * @link /api/users/:userId/profile
 */
export async function deleteUserProfile(userId: DeleteUserProfilePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteUserProfileMutationResponse>["data"]> {
    const res = await client<DeleteUserProfileMutationResponse>({ method: "delete", url: `/api/users/${userId}/profile`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}