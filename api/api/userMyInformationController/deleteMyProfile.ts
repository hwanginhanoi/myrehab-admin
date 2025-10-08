import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteMyProfileMutationResponse } from "../../types/DeleteMyProfile";

 /**
 * @description Delete your own profile information
 * @summary Delete my profile
 * @link /api/users/api/users/me/profile
 */
export async function deleteMyProfile(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteMyProfileMutationResponse>["data"]> {
    const res = await client<DeleteMyProfileMutationResponse>({ method: "delete", url: `/api/users/api/users/me/profile`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}