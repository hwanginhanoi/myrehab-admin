import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCategoriesPaginatedQueryResponse, GetAllCategoriesPaginatedQueryParams } from "../../types/GetAllCategoriesPaginated";

 /**
 * @description Retrieve a paginated list of active categories
 * @summary Get paginated categories
 * @link /api/categories/paginated
 */
export async function getAllCategoriesPaginated(params?: GetAllCategoriesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCategoriesPaginatedQueryResponse>["data"]> {
    const res = await client<GetAllCategoriesPaginatedQueryResponse>({ method: "get", url: `/api/categories/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}