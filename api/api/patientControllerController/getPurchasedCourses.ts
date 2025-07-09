import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetPurchasedCoursesQueryResponse, GetPurchasedCoursesPathParams } from "../../types/GetPurchasedCourses";

 /**
 * @link /api/patients/:patientId/courses/purchased
 */
export async function getPurchasedCourses(patientId: GetPurchasedCoursesPathParams["patientId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPurchasedCoursesQueryResponse>["data"]> {
    const res = await client<GetPurchasedCoursesQueryResponse>({ method: "get", url: `/api/patients/${patientId}/courses/purchased`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}