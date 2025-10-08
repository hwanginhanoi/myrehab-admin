import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetNationalHealthInsuranceQueryResponse, GetNationalHealthInsurancePathParams } from "../../types/GetNationalHealthInsurance";

 /**
 * @description Admin can retrieve any user's national health insurance information
 * @summary [Admin] Get user's national health insurance
 * @link /api/users/:userId/national-health-insurance
 */
export async function getNationalHealthInsurance(userId: GetNationalHealthInsurancePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetNationalHealthInsuranceQueryResponse>["data"]> {
    const res = await client<GetNationalHealthInsuranceQueryResponse>({ method: "get", url: `/api/users/${userId}/national-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}