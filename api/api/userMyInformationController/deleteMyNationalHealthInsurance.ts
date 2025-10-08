import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteMyNationalHealthInsuranceMutationResponse } from "../../types/DeleteMyNationalHealthInsurance";

 /**
 * @description Delete your own national health insurance information
 * @summary Delete my national health insurance
 * @link /api/users/api/users/me/national-health-insurance
 */
export async function deleteMyNationalHealthInsurance(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteMyNationalHealthInsuranceMutationResponse>["data"]> {
    const res = await client<DeleteMyNationalHealthInsuranceMutationResponse>({ method: "delete", url: `/api/users/api/users/me/national-health-insurance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}