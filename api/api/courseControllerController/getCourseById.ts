import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetCourseByIdQueryResponse, GetCourseByIdPathParams } from "../../types/GetCourseById";

 /**
 * @link /api/courses/:id
 */
export async function getCourseById(id: GetCourseByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetCourseByIdQueryResponse>["data"]> {
    const res = await client<GetCourseByIdQueryResponse>({ method: "get", url: `/api/courses/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}