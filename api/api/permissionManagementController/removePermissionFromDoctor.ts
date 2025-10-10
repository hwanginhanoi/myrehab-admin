import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemovePermissionFromDoctorMutationRequest, RemovePermissionFromDoctorMutationResponse, RemovePermissionFromDoctorPathParams } from "../../types/RemovePermissionFromDoctor";

 /**
 * @description Remove a permission from a doctor by permission name
 * @summary Remove permission from doctor
 * @link /api/permissions/doctor/:doctorId/remove
 */
export async function removePermissionFromDoctor(doctorId: RemovePermissionFromDoctorPathParams["doctorId"], data?: RemovePermissionFromDoctorMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemovePermissionFromDoctorMutationResponse>["data"]> {
    const res = await client<RemovePermissionFromDoctorMutationResponse, RemovePermissionFromDoctorMutationRequest>({ method: "delete", url: `/api/permissions/doctor/${doctorId}/remove`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}