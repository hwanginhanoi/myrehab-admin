import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateCategory1MutationRequest, UpdateCategory1MutationResponse, UpdateCategory1PathParams } from "../../types/UpdateCategory1";

 /**
 * @description Update an existing course category (Admin only)
 * @summary Update course category
 * @link /api/course-categories/:id
 */
export async function updateCategory1(id: UpdateCategory1PathParams["id"], data: UpdateCategory1MutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateCategory1MutationResponse>["data"]> {
    const res = await client<UpdateCategory1MutationResponse, UpdateCategory1MutationRequest>({ method: "put", url: `/api/course-categories/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}