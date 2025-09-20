import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCoursesByCategoryQueryResponse, GetCoursesByCategoryPathParams } from "../../types/GetCoursesByCategory";

 /**
 * @description Retrieve all courses belonging to a specific category
 * @summary Get courses by category
 * @link /api/courses/category/:categoryId
 */
export async function getCoursesByCategory(categoryId: GetCoursesByCategoryPathParams["categoryId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCoursesByCategoryQueryResponse>["data"]> {
    const res = await client<GetCoursesByCategoryQueryResponse>({ method: "get", url: `/api/courses/category/${categoryId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}