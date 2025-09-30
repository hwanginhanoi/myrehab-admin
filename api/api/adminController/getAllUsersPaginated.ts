import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllUsersPaginatedQueryResponse, GetAllUsersPaginatedQueryParams } from "../../types/GetAllUsersPaginated";

 /**
 * @description Get all users with pagination support (Admin only)
 * @summary Get all users with pagination
 * @link /api/admin/users/paginated
 */
export async function getAllUsersPaginated(params: GetAllUsersPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllUsersPaginatedQueryResponse>["data"]> {
    const res = await client<GetAllUsersPaginatedQueryResponse>({ method: "get", url: `/api/admin/users/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}