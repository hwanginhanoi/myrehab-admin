import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteCourseMutationResponse, DeleteCoursePathParams } from "../../types/DeleteCourse";

 /**
 * @link /api/courses/:id
 */
export async function deleteCourse(id: DeleteCoursePathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteCourseMutationResponse>["data"]> {
    const res = await client<DeleteCourseMutationResponse>({ method: "delete", url: `/api/courses/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}