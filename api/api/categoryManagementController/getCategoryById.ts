import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoryByIdQueryResponse, GetCategoryByIdPathParams } from "../../types/GetCategoryById";

 /**
 * @description Retrieve a specific category by its ID
 * @summary Get category by ID
 * @link /api/categories/:id
 */
export async function getCategoryById(id: GetCategoryByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoryByIdQueryResponse>["data"]> {
    const res = await client<GetCategoryByIdQueryResponse>({ method: "get", url: `/api/categories/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}