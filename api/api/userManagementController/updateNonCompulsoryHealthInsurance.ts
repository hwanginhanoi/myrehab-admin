import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateNonCompulsoryHealthInsuranceMutationRequest, UpdateNonCompulsoryHealthInsuranceMutationResponse, UpdateNonCompulsoryHealthInsurancePathParams } from "../../types/UpdateNonCompulsoryHealthInsurance";

 /**
 * @description Admin can create or update any user's non-compulsory health insurance information
 * @summary [Admin] Update user's non-compulsory health insurance
 * @link /api/users/:userId/non-compulsory-health-insurance
 */
export async function updateNonCompulsoryHealthInsurance(userId: UpdateNonCompulsoryHealthInsurancePathParams["userId"], data?: UpdateNonCompulsoryHealthInsuranceMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateNonCompulsoryHealthInsuranceMutationResponse>["data"]> {
    const res = await client<UpdateNonCompulsoryHealthInsuranceMutationResponse, UpdateNonCompulsoryHealthInsuranceMutationRequest>({ method: "put", url: `/api/users/${userId}/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}