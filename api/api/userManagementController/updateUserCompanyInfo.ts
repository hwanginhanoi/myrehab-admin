import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateUserCompanyInfoMutationRequest, UpdateUserCompanyInfoMutationResponse, UpdateUserCompanyInfoPathParams } from "../../types/UpdateUserCompanyInfo";

 /**
 * @description Admin can create or update any user's company information
 * @summary [Admin] Update user's company information
 * @link /api/users/:userId/company-info
 */
export async function updateUserCompanyInfo(userId: UpdateUserCompanyInfoPathParams["userId"], data?: UpdateUserCompanyInfoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateUserCompanyInfoMutationResponse>["data"]> {
    const res = await client<UpdateUserCompanyInfoMutationResponse, UpdateUserCompanyInfoMutationRequest>({ method: "put", url: `/api/users/${userId}/company-info`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}