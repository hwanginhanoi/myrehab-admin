import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteMyNonCompulsoryHealthInsuranceMutationResponse } from "../../types/DeleteMyNonCompulsoryHealthInsurance";

 /**
 * @description Delete your own non-compulsory health insurance information
 * @summary Delete my non-compulsory health insurance
 * @link /api/users/api/users/me/non-compulsory-health-insurance
 */
export async function deleteMyNonCompulsoryHealthInsurance(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteMyNonCompulsoryHealthInsuranceMutationResponse>["data"]> {
    const res = await client<DeleteMyNonCompulsoryHealthInsuranceMutationResponse>({ method: "delete", url: `/api/users/api/users/me/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}