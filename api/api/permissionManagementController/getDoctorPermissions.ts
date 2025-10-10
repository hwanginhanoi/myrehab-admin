import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetDoctorPermissionsQueryResponse, GetDoctorPermissionsPathParams } from "../../types/GetDoctorPermissions";

 /**
 * @description Get all permissions for a doctor
 * @summary Get doctor permissions
 * @link /api/permissions/doctor/:doctorId
 */
export async function getDoctorPermissions(doctorId: GetDoctorPermissionsPathParams["doctorId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetDoctorPermissionsQueryResponse>["data"]> {
    const res = await client<GetDoctorPermissionsQueryResponse>({ method: "get", url: `/api/permissions/doctor/${doctorId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}