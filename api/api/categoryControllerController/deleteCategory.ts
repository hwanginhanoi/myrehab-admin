import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteCategoryMutationResponse, DeleteCategoryPathParams } from "../../types/DeleteCategory";

 /**
 * @link /api/categories/:id
 */
export async function deleteCategory(id: DeleteCategoryPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteCategoryMutationResponse>["data"]> {
    const res = await client<DeleteCategoryMutationResponse>({ method: "delete", url: `/api/categories/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}