import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchPatientsQueryResponse, SearchPatientsQueryParams } from "../../types/SearchPatients";

 /**
 * @description Search patients by name or email
 * @summary Search patients
 * @link /api/admin/patients/search
 */
export async function searchPatients(params: SearchPatientsQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchPatientsQueryResponse>["data"]> {
    const res = await client<SearchPatientsQueryResponse>({ method: "get", url: `/api/admin/patients/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}