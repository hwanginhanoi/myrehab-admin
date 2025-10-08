import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyNationalHealthInsuranceQueryResponse } from "../../types/GetMyNationalHealthInsurance";

 /**
 * @description Retrieve your own national health insurance information
 * @summary Get my national health insurance
 * @link /api/users/api/users/me/national-health-insurance
 */
export async function getMyNationalHealthInsurance(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyNationalHealthInsuranceQueryResponse>["data"]> {
    const res = await client<GetMyNationalHealthInsuranceQueryResponse>({ method: "get", url: `/api/users/api/users/me/national-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}