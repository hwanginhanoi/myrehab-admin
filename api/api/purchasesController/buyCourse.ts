import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { BuyCourseMutationResponse, BuyCoursePathParams } from "../../types/BuyCourse";

 /**
 * @description Purchase a course
 * @summary Buy course
 * @link /api/purchases/course/:courseId
 */
export async function buyCourse(courseId: BuyCoursePathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<BuyCourseMutationResponse>["data"]> {
    const res = await client<BuyCourseMutationResponse>({ method: "post", url: `/api/purchases/course/${courseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}