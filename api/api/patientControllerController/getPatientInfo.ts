import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetPatientInfoQueryResponse, GetPatientInfoPathParams } from "../../types/GetPatientInfo";

 /**
 * @description Endpoint to get patient information by ID
 * @summary Get Patient Info
 * @link /api/patients/:id
 */
export async function getPatientInfo(id: GetPatientInfoPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPatientInfoQueryResponse>["data"]> {
    const res = await client<GetPatientInfoQueryResponse>({ method: "get", url: `/api/patients/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}