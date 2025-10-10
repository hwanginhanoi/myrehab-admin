import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCoursesPaginatedQueryResponse, GetAllCoursesPaginatedQueryParams } from "../../types/GetAllCoursesPaginated";

 /**
 * @description Retrieve a paginated list of active courses. Use query params: ?page=0&size=10&sort=createdAt,desc
 * @summary Get paginated courses
 * @link /api/courses/paginated
 */
export async function getAllCoursesPaginated(params: GetAllCoursesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCoursesPaginatedQueryResponse>["data"]> {
    const res = await client<GetAllCoursesPaginatedQueryResponse>({ method: "get", url: `/api/courses/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}