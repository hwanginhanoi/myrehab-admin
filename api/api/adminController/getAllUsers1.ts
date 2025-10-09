import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllUsers1QueryResponse, GetAllUsers1QueryParams } from "../../types/GetAllUsers1";

 /**
 * @description Get all users with pagination support (Admin only)
 * @summary Get all users with pagination
 * @link /api/admin/users
 */
export async function getAllUsers1(params: GetAllUsers1QueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllUsers1QueryResponse>["data"]> {
    const res = await client<GetAllUsers1QueryResponse>({ method: "get", url: `/api/admin/users`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}