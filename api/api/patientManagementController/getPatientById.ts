import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetPatientByIdQueryResponse, GetPatientByIdPathParams } from "../../types/GetPatientById";

 /**
 * @description Retrieves a specific patient by their ID
 * @summary Get patient by ID
 * @link /api/admin/patients/:id
 */
export async function getPatientById(id: GetPatientByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPatientByIdQueryResponse>["data"]> {
    const res = await client<GetPatientByIdQueryResponse>({ method: "get", url: `/api/admin/patients/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}