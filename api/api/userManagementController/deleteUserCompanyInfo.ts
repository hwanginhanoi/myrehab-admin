import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteUserCompanyInfoMutationResponse, DeleteUserCompanyInfoPathParams } from "../../types/DeleteUserCompanyInfo";

 /**
 * @description Admin can delete any user's company information
 * @summary [Admin] Delete user's company information
 * @link /api/users/:userId/company-info
 */
export async function deleteUserCompanyInfo(userId: DeleteUserCompanyInfoPathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteUserCompanyInfoMutationResponse>["data"]> {
    const res = await client<DeleteUserCompanyInfoMutationResponse>({ method: "delete", url: `/api/users/${userId}/company-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}