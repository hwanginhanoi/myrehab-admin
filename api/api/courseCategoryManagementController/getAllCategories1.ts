import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCategories1QueryResponse } from "../../types/GetAllCategories1";

 /**
 * @description Retrieve a list of all active course categories
 * @summary Get all active course categories
 * @link /api/course-categories
 */
export async function getAllCategories1(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCategories1QueryResponse>["data"]> {
    const res = await client<GetAllCategories1QueryResponse>({ method: "get", url: `/api/course-categories`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}