import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AssignPermissionToAdminMutationRequest, AssignPermissionToAdminMutationResponse, AssignPermissionToAdminPathParams } from "../../types/AssignPermissionToAdmin";

 /**
 * @description Assign a permission to an admin by permission name
 * @summary Assign permission to admin
 * @link /api/permissions/admin/:adminId/assign
 */
export async function assignPermissionToAdmin(adminId: AssignPermissionToAdminPathParams["adminId"], data?: AssignPermissionToAdminMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AssignPermissionToAdminMutationResponse>["data"]> {
    const res = await client<AssignPermissionToAdminMutationResponse, AssignPermissionToAdminMutationRequest>({ method: "post", url: `/api/permissions/admin/${adminId}/assign`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}