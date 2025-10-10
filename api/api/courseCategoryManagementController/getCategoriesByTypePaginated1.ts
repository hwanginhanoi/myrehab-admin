import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoriesByTypePaginated1QueryResponse, GetCategoriesByTypePaginated1PathParams, GetCategoriesByTypePaginated1QueryParams } from "../../types/GetCategoriesByTypePaginated1";

 /**
 * @description Retrieve a paginated list of course categories by type. Use query params: ?page=0&size=10&sort=name,desc
 * @summary Get paginated course categories by type
 * @link /api/course-categories/type/:type/paginated
 */
export async function getCategoriesByTypePaginated1(type: GetCategoriesByTypePaginated1PathParams["type"], params: GetCategoriesByTypePaginated1QueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoriesByTypePaginated1QueryResponse>["data"]> {
    const res = await client<GetCategoriesByTypePaginated1QueryResponse>({ method: "get", url: `/api/course-categories/type/${type}/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}