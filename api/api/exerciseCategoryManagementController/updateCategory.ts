import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateCategoryMutationRequest, UpdateCategoryMutationResponse, UpdateCategoryPathParams } from "../../types/UpdateCategory";

 /**
 * @description Update an existing exercise category (Admin only)
 * @summary Update exercise category
 * @link /api/exercise-categories/:id
 */
export async function updateCategory(id: UpdateCategoryPathParams["id"], data: UpdateCategoryMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateCategoryMutationResponse>["data"]> {
    const res = await client<UpdateCategoryMutationResponse, UpdateCategoryMutationRequest>({ method: "put", url: `/api/exercise-categories/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}