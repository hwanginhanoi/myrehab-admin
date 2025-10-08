import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoriesByTypePaginatedQueryResponse, GetCategoriesByTypePaginatedPathParams, GetCategoriesByTypePaginatedQueryParams } from "../../types/GetCategoriesByTypePaginated";

 /**
 * @description Retrieve a paginated list of exercise categories by type
 * @summary Get paginated exercise categories by type
 * @link /api/exercise-categories/type/:type/paginated
 */
export async function getCategoriesByTypePaginated(type: GetCategoriesByTypePaginatedPathParams["type"], params?: GetCategoriesByTypePaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoriesByTypePaginatedQueryResponse>["data"]> {
    const res = await client<GetCategoriesByTypePaginatedQueryResponse>({ method: "get", url: `/api/exercise-categories/type/${type}/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}