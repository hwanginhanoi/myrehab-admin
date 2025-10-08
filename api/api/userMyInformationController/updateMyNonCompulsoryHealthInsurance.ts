import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateMyNonCompulsoryHealthInsuranceMutationRequest, UpdateMyNonCompulsoryHealthInsuranceMutationResponse } from "../../types/UpdateMyNonCompulsoryHealthInsurance";

 /**
 * @description Create or update your own non-compulsory health insurance information
 * @summary Update my non-compulsory health insurance
 * @link /api/users/api/users/me/non-compulsory-health-insurance
 */
export async function updateMyNonCompulsoryHealthInsurance(data?: UpdateMyNonCompulsoryHealthInsuranceMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateMyNonCompulsoryHealthInsuranceMutationResponse>["data"]> {
    const res = await client<UpdateMyNonCompulsoryHealthInsuranceMutationResponse, UpdateMyNonCompulsoryHealthInsuranceMutationRequest>({ method: "put", url: `/api/users/api/users/me/non-compulsory-health-insurance`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}