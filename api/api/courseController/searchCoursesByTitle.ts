import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCoursesByTitleQueryResponse, SearchCoursesByTitleQueryParams } from "../../types/SearchCoursesByTitle";

 /**
 * @summary Search courses by title
 * @link /api/courses/search
 */
export async function searchCoursesByTitle(params: SearchCoursesByTitleQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCoursesByTitleQueryResponse>["data"]> {
    const res = await client<SearchCoursesByTitleQueryResponse>({ method: "get", url: `/api/courses/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}