import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAdminPermissionsQueryResponse, GetAdminPermissionsPathParams } from "../../types/GetAdminPermissions";

 /**
 * @description Get all permissions for an admin
 * @summary Get admin permissions
 * @link /api/permissions/admin/:adminId
 */
export async function getAdminPermissions(adminId: GetAdminPermissionsPathParams["adminId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAdminPermissionsQueryResponse>["data"]> {
    const res = await client<GetAdminPermissionsQueryResponse>({ method: "get", url: `/api/permissions/admin/${adminId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}