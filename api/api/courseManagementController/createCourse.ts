import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CreateCourseMutationRequest, CreateCourseMutationResponse } from "../../types/CreateCourse";

 /**
 * @description Create a new rehabilitation course (Admin and Doctor only)
 * @summary Create new course
 * @link /api/courses
 */
export async function createCourse(data: CreateCourseMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateCourseMutationResponse>["data"]> {
    const res = await client<CreateCourseMutationResponse, CreateCourseMutationRequest>({ method: "post", url: `/api/courses`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}