import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateCourseMutationRequest, UpdateCourseMutationResponse, UpdateCoursePathParams } from "../../types/UpdateCourse";

 /**
 * @summary Update an existing course
 * @link /api/courses/:id
 */
export async function updateCourse(id: UpdateCoursePathParams["id"], data?: UpdateCourseMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateCourseMutationResponse>["data"]> {
    const res = await client<UpdateCourseMutationResponse, UpdateCourseMutationRequest>({ method: "put", url: `/api/courses/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}