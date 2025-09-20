import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCategoriesQueryResponse } from "../../types/GetAllCategories";

 /**
 * @description Retrieve a list of all active categories
 * @summary Get all active categories
 * @link /api/categories
 */
export async function getAllCategories(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCategoriesQueryResponse>["data"]> {
    const res = await client<GetAllCategoriesQueryResponse>({ method: "get", url: `/api/categories`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}