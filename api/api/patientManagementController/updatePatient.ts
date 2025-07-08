import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdatePatientMutationRequest, UpdatePatientMutationResponse, UpdatePatientPathParams } from "../../types/UpdatePatient";

 /**
 * @description Updates an existing patient's information
 * @summary Update a patient
 * @link /api/admin/patients/:id
 */
export async function updatePatient(id: UpdatePatientPathParams["id"], data: UpdatePatientMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdatePatientMutationResponse>["data"]> {
    const res = await client<UpdatePatientMutationResponse, UpdatePatientMutationRequest>({ method: "put", url: `/api/admin/patients/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}