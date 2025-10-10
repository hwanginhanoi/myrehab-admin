import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SetAdminPermissionsMutationRequest, SetAdminPermissionsMutationResponse, SetAdminPermissionsPathParams } from "../../types/SetAdminPermissions";

 /**
 * @description Set all permissions for an admin (replaces existing)
 * @summary Set admin permissions
 * @link /api/permissions/admin/:adminId
 */
export async function setAdminPermissions(adminId: SetAdminPermissionsPathParams["adminId"], data?: SetAdminPermissionsMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SetAdminPermissionsMutationResponse>["data"]> {
    const res = await client<SetAdminPermissionsMutationResponse, SetAdminPermissionsMutationRequest>({ method: "put", url: `/api/permissions/admin/${adminId}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}