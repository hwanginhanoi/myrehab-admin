import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoriesByType1QueryResponse, GetCategoriesByType1PathParams } from "../../types/GetCategoriesByType1";

 /**
 * @description Retrieve all course categories of a specific type
 * @summary Get course categories by type
 * @link /api/course-categories/type/:type
 */
export async function getCategoriesByType1(type: GetCategoriesByType1PathParams["type"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoriesByType1QueryResponse>["data"]> {
    const res = await client<GetCategoriesByType1QueryResponse>({ method: "get", url: `/api/course-categories/type/${type}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}