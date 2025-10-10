import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AssignPermissionToDoctorMutationRequest, AssignPermissionToDoctorMutationResponse, AssignPermissionToDoctorPathParams } from "../../types/AssignPermissionToDoctor";

 /**
 * @description Assign a permission to a doctor by permission name
 * @summary Assign permission to doctor
 * @link /api/permissions/doctor/:doctorId/assign
 */
export async function assignPermissionToDoctor(doctorId: AssignPermissionToDoctorPathParams["doctorId"], data?: AssignPermissionToDoctorMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AssignPermissionToDoctorMutationResponse>["data"]> {
    const res = await client<AssignPermissionToDoctorMutationResponse, AssignPermissionToDoctorMutationRequest>({ method: "post", url: `/api/permissions/doctor/${doctorId}/assign`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}