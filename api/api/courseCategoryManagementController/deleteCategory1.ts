import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteCategory1MutationResponse, DeleteCategory1PathParams } from "../../types/DeleteCategory1";

 /**
 * @description Delete a course category (Admin only)
 * @summary Delete course category
 * @link /api/course-categories/:id
 */
export async function deleteCategory1(id: DeleteCategory1PathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteCategory1MutationResponse>["data"]> {
    const res = await client<DeleteCategory1MutationResponse>({ method: "delete", url: `/api/course-categories/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}