import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoriesByTypeQueryResponse, GetCategoriesByTypePathParams } from "../../types/GetCategoriesByType";

 /**
 * @description Retrieve all categories of a specific type
 * @summary Get categories by type
 * @link /api/categories/type/:type
 */
export async function getCategoriesByType(type: GetCategoriesByTypePathParams["type"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoriesByTypeQueryResponse>["data"]> {
    const res = await client<GetCategoriesByTypeQueryResponse>({ method: "get", url: `/api/categories/type/${type}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}