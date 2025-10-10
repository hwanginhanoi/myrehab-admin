import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SetDoctorPermissionsMutationRequest, SetDoctorPermissionsMutationResponse, SetDoctorPermissionsPathParams } from "../../types/SetDoctorPermissions";

 /**
 * @description Set all permissions for a doctor (replaces existing)
 * @summary Set doctor permissions
 * @link /api/permissions/doctor/:doctorId
 */
export async function setDoctorPermissions(doctorId: SetDoctorPermissionsPathParams["doctorId"], data?: SetDoctorPermissionsMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SetDoctorPermissionsMutationResponse>["data"]> {
    const res = await client<SetDoctorPermissionsMutationResponse, SetDoctorPermissionsMutationRequest>({ method: "put", url: `/api/permissions/doctor/${doctorId}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}