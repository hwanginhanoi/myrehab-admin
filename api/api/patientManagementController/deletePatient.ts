import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeletePatientMutationResponse, DeletePatientPathParams } from "../../types/DeletePatient";

 /**
 * @description Deletes a patient from the system
 * @summary Delete a patient
 * @link /api/admin/patients/:id
 */
export async function deletePatient(id: DeletePatientPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeletePatientMutationResponse>["data"]> {
    const res = await client<DeletePatientMutationResponse>({ method: "delete", url: `/api/admin/patients/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}