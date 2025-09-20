import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateCategoryMutationRequest, UpdateCategoryMutationResponse, UpdateCategoryPathParams } from "../../types/UpdateCategory";

 /**
 * @description Update an existing category (Admin only)
 * @summary Update category
 * @link /api/categories/:id
 */
export async function updateCategory(id: UpdateCategoryPathParams["id"], data: UpdateCategoryMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateCategoryMutationResponse>["data"]> {
    const res = await client<UpdateCategoryMutationResponse, UpdateCategoryMutationRequest>({ method: "put", url: `/api/categories/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}