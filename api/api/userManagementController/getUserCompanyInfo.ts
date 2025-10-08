import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetUserCompanyInfoQueryResponse, GetUserCompanyInfoPathParams } from "../../types/GetUserCompanyInfo";

 /**
 * @description Admin can retrieve any user's company information for billing
 * @summary [Admin] Get user's company information
 * @link /api/users/:userId/company-info
 */
export async function getUserCompanyInfo(userId: GetUserCompanyInfoPathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUserCompanyInfoQueryResponse>["data"]> {
    const res = await client<GetUserCompanyInfoQueryResponse>({ method: "get", url: `/api/users/${userId}/company-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}