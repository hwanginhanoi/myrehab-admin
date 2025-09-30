import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllUsersQueryResponse } from "../../types/GetAllUsers";

 /**
 * @description Retrieve a list of all users in the system (Admin/Doctor only)
 * @summary Get all users
 * @link /api/users
 */
export async function getAllUsers(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllUsersQueryResponse>["data"]> {
    const res = await client<GetAllUsersQueryResponse>({ method: "get", url: `/api/users`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}