import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyCompanyInfoQueryResponse } from "../../types/GetMyCompanyInfo";

 /**
 * @description Retrieve your own company information for billing
 * @summary Get my company information
 * @link /api/users/api/users/me/company-info
 */
export async function getMyCompanyInfo(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyCompanyInfoQueryResponse>["data"]> {
    const res = await client<GetMyCompanyInfoQueryResponse>({ method: "get", url: `/api/users/api/users/me/company-info`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}