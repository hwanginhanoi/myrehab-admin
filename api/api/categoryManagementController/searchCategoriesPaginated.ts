import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCategoriesPaginatedQueryResponse, SearchCategoriesPaginatedQueryParams } from "../../types/SearchCategoriesPaginated";

 /**
 * @description Search categories by keyword with pagination
 * @summary Search categories with pagination
 * @link /api/categories/search/paginated
 */
export async function searchCategoriesPaginated(params: SearchCategoriesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCategoriesPaginatedQueryResponse>["data"]> {
    const res = await client<SearchCategoriesPaginatedQueryResponse>({ method: "get", url: `/api/categories/search/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}