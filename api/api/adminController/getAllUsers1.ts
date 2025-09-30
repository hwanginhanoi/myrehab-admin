import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllUsers1QueryResponse } from "../../types/GetAllUsers1";

 /**
 * @description Get all users in the system (Admin only)
 * @summary Get all users
 * @link /api/admin/users
 */
export async function getAllUsers1(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllUsers1QueryResponse>["data"]> {
    const res = await client<GetAllUsers1QueryResponse>({ method: "get", url: `/api/admin/users`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}