import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateMyCompanyInfoMutationRequest, UpdateMyCompanyInfoMutationResponse } from "../../types/UpdateMyCompanyInfo";

 /**
 * @description Create or update your own company information
 * @summary Update my company information
 * @link /api/users/me/company-info
 */
export async function updateMyCompanyInfo(data?: UpdateMyCompanyInfoMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateMyCompanyInfoMutationResponse>["data"]> {
    const res = await client<UpdateMyCompanyInfoMutationResponse, UpdateMyCompanyInfoMutationRequest>({ method: "put", url: `/api/users/me/company-info`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}