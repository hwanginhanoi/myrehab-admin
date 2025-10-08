import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCategoriesPaginated1QueryResponse, GetAllCategoriesPaginated1QueryParams } from "../../types/GetAllCategoriesPaginated1";

 /**
 * @description Retrieve a paginated list of active course categories
 * @summary Get paginated course categories
 * @link /api/course-categories/paginated
 */
export async function getAllCategoriesPaginated1(params?: GetAllCategoriesPaginated1QueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCategoriesPaginated1QueryResponse>["data"]> {
    const res = await client<GetAllCategoriesPaginated1QueryResponse>({ method: "get", url: `/api/course-categories/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}