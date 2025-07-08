import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AssignCourseToPatientMutationResponse, AssignCourseToPatientPathParams } from "../../types/AssignCourseToPatient";

 /**
 * @description Assigns a course to a patient
 * @summary Assign course to patient
 * @link /api/admin/patients/:patientId/assign-course/:courseId
 */
export async function assignCourseToPatient(patientId: AssignCourseToPatientPathParams["patientId"], courseId: AssignCourseToPatientPathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AssignCourseToPatientMutationResponse>["data"]> {
    const res = await client<AssignCourseToPatientMutationResponse>({ method: "post", url: `/api/admin/patients/${patientId}/assign-course/${courseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}