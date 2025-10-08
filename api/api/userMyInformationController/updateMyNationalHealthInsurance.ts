import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateMyNationalHealthInsuranceMutationRequest, UpdateMyNationalHealthInsuranceMutationResponse } from "../../types/UpdateMyNationalHealthInsurance";

 /**
 * @description Create or update your own national health insurance information
 * @summary Update my national health insurance
 * @link /api/users/api/users/me/national-health-insurance
 */
export async function updateMyNationalHealthInsurance(data?: UpdateMyNationalHealthInsuranceMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateMyNationalHealthInsuranceMutationResponse>["data"]> {
    const res = await client<UpdateMyNationalHealthInsuranceMutationResponse, UpdateMyNationalHealthInsuranceMutationRequest>({ method: "put", url: `/api/users/api/users/me/national-health-insurance`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}