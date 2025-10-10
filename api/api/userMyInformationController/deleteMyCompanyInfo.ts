import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteMyCompanyInfoMutationResponse } from "../../types/DeleteMyCompanyInfo";

 /**
 * @description Delete your own company information
 * @summary Delete my company information
 * @link /api/users/me/company-info
 */
export async function deleteMyCompanyInfo(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteMyCompanyInfoMutationResponse>["data"]> {
    const res = await client<DeleteMyCompanyInfoMutationResponse>({ method: "delete", url: `/api/users/me/company-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}