import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCategoriesQueryResponse, SearchCategoriesQueryParams } from "../../types/SearchCategories";

 /**
 * @description Search categories by keyword in name
 * @summary Search categories
 * @link /api/categories/search
 */
export async function searchCategories(params: SearchCategoriesQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCategoriesQueryResponse>["data"]> {
    const res = await client<SearchCategoriesQueryResponse>({ method: "get", url: `/api/categories/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}