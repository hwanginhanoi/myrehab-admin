import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AssignCourseToPatientMutationResponse, AssignCourseToPatientPathParams } from "../../types/AssignCourseToPatient";

 /**
 * @link /api/patients/:patientId/courses/:courseId/assign
 */
export async function assignCourseToPatient(patientId: AssignCourseToPatientPathParams["patientId"], courseId: AssignCourseToPatientPathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AssignCourseToPatientMutationResponse>["data"]> {
    const res = await client<AssignCourseToPatientMutationResponse>({ method: "post", url: `/api/patients/${patientId}/courses/${courseId}/assign`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}