import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCoursesByCategoryIdQueryResponse, GetCoursesByCategoryIdPathParams } from "../../types/GetCoursesByCategoryId";

 /**
 * @summary Get courses by category ID
 * @link /api/courses/category/:categoryId
 */
export async function getCoursesByCategoryId(categoryId: GetCoursesByCategoryIdPathParams["categoryId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCoursesByCategoryIdQueryResponse>["data"]> {
    const res = await client<GetCoursesByCategoryIdQueryResponse>({ method: "get", url: `/api/courses/category/${categoryId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}