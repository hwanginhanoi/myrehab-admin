import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCategoryById1QueryResponse, GetCategoryById1PathParams } from "../../types/GetCategoryById1";

 /**
 * @description Retrieve a specific course category by its ID
 * @summary Get course category by ID
 * @link /api/course-categories/:id
 */
export async function getCategoryById1(id: GetCategoryById1PathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCategoryById1QueryResponse>["data"]> {
    const res = await client<GetCategoryById1QueryResponse>({ method: "get", url: `/api/course-categories/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}