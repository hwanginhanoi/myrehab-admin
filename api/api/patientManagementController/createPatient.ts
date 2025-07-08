import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CreatePatientMutationRequest, CreatePatientMutationResponse } from "../../types/CreatePatient";

 /**
 * @description Creates a new patient account
 * @summary Create a new patient
 * @link /api/admin/patients
 */
export async function createPatient(data: CreatePatientMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreatePatientMutationResponse>["data"]> {
    const res = await client<CreatePatientMutationResponse, CreatePatientMutationRequest>({ method: "post", url: `/api/admin/patients`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}