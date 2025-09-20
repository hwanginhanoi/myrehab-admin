import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllCoursesQueryResponse } from "../../types/GetAllCourses";

 /**
 * @description Retrieve a list of all active courses
 * @summary Get all active courses
 * @link /api/courses
 */
export async function getAllCourses(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllCoursesQueryResponse>["data"]> {
    const res = await client<GetAllCoursesQueryResponse>({ method: "get", url: `/api/courses`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}