import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CreateCategory1MutationRequest, CreateCategory1MutationResponse } from "../../types/CreateCategory1";

 /**
 * @description Create a new course category (Admin only)
 * @summary Create new course category
 * @link /api/course-categories
 */
export async function createCategory1(data: CreateCategory1MutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateCategory1MutationResponse>["data"]> {
    const res = await client<CreateCategory1MutationResponse, CreateCategory1MutationRequest>({ method: "post", url: `/api/course-categories`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}