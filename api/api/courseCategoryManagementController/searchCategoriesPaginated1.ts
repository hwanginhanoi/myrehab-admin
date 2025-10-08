import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCategoriesPaginated1QueryResponse, SearchCategoriesPaginated1QueryParams } from "../../types/SearchCategoriesPaginated1";

 /**
 * @description Search course categories by keyword with pagination
 * @summary Search course categories with pagination
 * @link /api/course-categories/search/paginated
 */
export async function searchCategoriesPaginated1(params: SearchCategoriesPaginated1QueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCategoriesPaginated1QueryResponse>["data"]> {
    const res = await client<SearchCategoriesPaginated1QueryResponse>({ method: "get", url: `/api/course-categories/search/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}