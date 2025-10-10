import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyNonCompulsoryHealthInsuranceQueryResponse } from "../../types/GetMyNonCompulsoryHealthInsurance";

 /**
 * @description Retrieve your own non-compulsory health insurance information
 * @summary Get my non-compulsory health insurance
 * @link /api/users/me/non-compulsory-health-insurance
 */
export async function getMyNonCompulsoryHealthInsurance(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyNonCompulsoryHealthInsuranceQueryResponse>["data"]> {
    const res = await client<GetMyNonCompulsoryHealthInsuranceQueryResponse>({ method: "get", url: `/api/users/me/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}