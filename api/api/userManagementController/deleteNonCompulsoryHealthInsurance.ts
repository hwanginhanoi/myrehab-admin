import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteNonCompulsoryHealthInsuranceMutationResponse, DeleteNonCompulsoryHealthInsurancePathParams } from "../../types/DeleteNonCompulsoryHealthInsurance";

 /**
 * @description Admin can delete any user's non-compulsory health insurance information
 * @summary [Admin] Delete user's non-compulsory health insurance
 * @link /api/users/:userId/non-compulsory-health-insurance
 */
export async function deleteNonCompulsoryHealthInsurance(userId: DeleteNonCompulsoryHealthInsurancePathParams["userId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteNonCompulsoryHealthInsuranceMutationResponse>["data"]> {
    const res = await client<DeleteNonCompulsoryHealthInsuranceMutationResponse>({ method: "delete", url: `/api/users/${userId}/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}