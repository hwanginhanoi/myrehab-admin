import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteNationalHealthInsuranceMutationResponse, DeleteNationalHealthInsurancePathParams } from "../../types/DeleteNationalHealthInsurance";

 /**
 * @description Admin can delete any user's national health insurance information
 * @summary [Admin] Delete user's national health insurance
 * @link /api/users/:userId/national-health-insurance
 */
export async function deleteNationalHealthInsurance(userId: DeleteNationalHealthInsurancePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteNationalHealthInsuranceMutationResponse>["data"]> {
    const res = await client<DeleteNationalHealthInsuranceMutationResponse>({ method: "delete", url: `/api/users/${userId}/national-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}