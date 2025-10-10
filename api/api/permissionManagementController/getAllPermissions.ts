import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllPermissionsQueryResponse } from "../../types/GetAllPermissions";

 /**
 * @description Retrieve list of all available permissions from hardcoded constants
 * @summary Get all available permissions
 * @link /api/permissions
 */
export async function getAllPermissions(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllPermissionsQueryResponse>["data"]> {
    const res = await client<GetAllPermissionsQueryResponse>({ method: "get", url: `/api/permissions`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}