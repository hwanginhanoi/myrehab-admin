import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchCoursesQueryResponse, SearchCoursesQueryParams } from "../../types/SearchCourses";

 /**
 * @description Search courses by keyword in title
 * @summary Search courses
 * @link /api/courses/search
 */
export async function searchCourses(params: SearchCoursesQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchCoursesQueryResponse>["data"]> {
    const res = await client<SearchCoursesQueryResponse>({ method: "get", url: `/api/courses/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}