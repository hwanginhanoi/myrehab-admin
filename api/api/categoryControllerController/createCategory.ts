import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CreateCategoryMutationRequest, CreateCategoryMutationResponse } from "../../types/CreateCategory";

 /**
 * @link /api/categories
 */
export async function createCategory(data: CreateCategoryMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateCategoryMutationResponse>["data"]> {
    const res = await client<CreateCategoryMutationResponse, CreateCategoryMutationRequest>({ method: "post", url: `/api/categories`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}