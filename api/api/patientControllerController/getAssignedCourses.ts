import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAssignedCoursesQueryResponse, GetAssignedCoursesPathParams } from "../../types/GetAssignedCourses";

 /**
 * @link /api/patients/:patientId/courses/assigned
 */
export async function getAssignedCourses(patientId: GetAssignedCoursesPathParams["patientId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAssignedCoursesQueryResponse>["data"]> {
    const res = await client<GetAssignedCoursesQueryResponse>({ method: "get", url: `/api/patients/${patientId}/courses/assigned`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}