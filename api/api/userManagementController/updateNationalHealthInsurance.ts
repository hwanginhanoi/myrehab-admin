import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateNationalHealthInsuranceMutationRequest, UpdateNationalHealthInsuranceMutationResponse, UpdateNationalHealthInsurancePathParams } from "../../types/UpdateNationalHealthInsurance";

 /**
 * @description Admin can create or update any user's national health insurance information
 * @summary [Admin] Update user's national health insurance
 * @link /api/users/:userId/national-health-insurance
 */
export async function updateNationalHealthInsurance(userId: UpdateNationalHealthInsurancePathParams["userId"], data?: UpdateNationalHealthInsuranceMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateNationalHealthInsuranceMutationResponse>["data"]> {
    const res = await client<UpdateNationalHealthInsuranceMutationResponse, UpdateNationalHealthInsuranceMutationRequest>({ method: "put", url: `/api/users/${userId}/national-health-insurance`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}