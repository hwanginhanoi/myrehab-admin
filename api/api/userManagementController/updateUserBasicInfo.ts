import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateUserBasicInfoMutationRequest, UpdateUserBasicInfoMutationResponse, UpdateUserBasicInfoPathParams } from "../../types/UpdateUserBasicInfo";

 /**
 * @description Admin can update any user's basic information
 * @summary [Admin] Update user basic info
 * @link /api/users/:userId/basic-info
 */
export async function updateUserBasicInfo(userId: UpdateUserBasicInfoPathParams["userId"], data?: UpdateUserBasicInfoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateUserBasicInfoMutationResponse>["data"]> {
    const res = await client<UpdateUserBasicInfoMutationResponse, UpdateUserBasicInfoMutationRequest>({ method: "put", url: `/api/users/${userId}/basic-info`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}