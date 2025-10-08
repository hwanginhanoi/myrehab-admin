import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateMyProfileMutationRequest, UpdateMyProfileMutationResponse } from "../../types/UpdateMyProfile";

 /**
 * @description Create or update your own profile information
 * @summary Update my profile
 * @link /api/users/api/users/me/profile
 */
export async function updateMyProfile(data?: UpdateMyProfileMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateMyProfileMutationResponse>["data"]> {
    const res = await client<UpdateMyProfileMutationResponse, UpdateMyProfileMutationRequest>({ method: "put", url: `/api/users/api/users/me/profile`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}