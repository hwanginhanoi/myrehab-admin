import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemovePermissionFromAdminMutationRequest, RemovePermissionFromAdminMutationResponse, RemovePermissionFromAdminPathParams } from "../../types/RemovePermissionFromAdmin";

 /**
 * @description Remove a permission from an admin by permission name
 * @summary Remove permission from admin
 * @link /api/permissions/admin/:adminId/remove
 */
export async function removePermissionFromAdmin(adminId: RemovePermissionFromAdminPathParams["adminId"], data?: RemovePermissionFromAdminMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemovePermissionFromAdminMutationResponse>["data"]> {
    const res = await client<RemovePermissionFromAdminMutationResponse, RemovePermissionFromAdminMutationRequest>({ method: "delete", url: `/api/permissions/admin/${adminId}/remove`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}