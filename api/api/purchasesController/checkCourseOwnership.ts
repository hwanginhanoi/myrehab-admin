import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CheckCourseOwnershipQueryResponse, CheckCourseOwnershipPathParams } from "../../types/CheckCourseOwnership";

 /**
 * @description Check if user owns a specific course
 * @summary Check course ownership
 * @link /api/purchases/check/course/:courseId
 */
export async function checkCourseOwnership(courseId: CheckCourseOwnershipPathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CheckCourseOwnershipQueryResponse>["data"]> {
    const res = await client<CheckCourseOwnershipQueryResponse>({ method: "get", url: `/api/purchases/check/course/${courseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}