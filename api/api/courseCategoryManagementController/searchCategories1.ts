import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCategories1QueryResponse, SearchCategories1QueryParams } from "../../types/SearchCategories1";

 /**
 * @description Search course categories by keyword in name
 * @summary Search course categories
 * @link /api/course-categories/search
 */
export async function searchCategories1(params: SearchCategories1QueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCategories1QueryResponse>["data"]> {
    const res = await client<SearchCategories1QueryResponse>({ method: "get", url: `/api/course-categories/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}