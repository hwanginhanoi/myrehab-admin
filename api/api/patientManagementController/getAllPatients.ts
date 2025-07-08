import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllPatientsQueryResponse } from "../../types/GetAllPatients";

 /**
 * @description Retrieves all patients in the system
 * @summary Get all patients
 * @link /api/admin/patients
 */
export async function getAllPatients(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllPatientsQueryResponse>["data"]> {
    const res = await client<GetAllPatientsQueryResponse>({ method: "get", url: `/api/admin/patients`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}