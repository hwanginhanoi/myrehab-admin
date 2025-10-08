import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetNonCompulsoryHealthInsuranceQueryResponse, GetNonCompulsoryHealthInsurancePathParams } from "../../types/GetNonCompulsoryHealthInsurance";

 /**
 * @description Admin can retrieve any user's non-compulsory health insurance information
 * @summary [Admin] Get user's non-compulsory health insurance
 * @link /api/users/:userId/non-compulsory-health-insurance
 */
export async function getNonCompulsoryHealthInsurance(userId: GetNonCompulsoryHealthInsurancePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetNonCompulsoryHealthInsuranceQueryResponse>["data"]> {
    const res = await client<GetNonCompulsoryHealthInsuranceQueryResponse>({ method: "get", url: `/api/users/${userId}/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}