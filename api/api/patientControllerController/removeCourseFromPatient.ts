import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemoveCourseFromPatientMutationResponse, RemoveCourseFromPatientPathParams } from "../../types/RemoveCourseFromPatient";

 /**
 * @link /api/patients/:patientId/courses/:courseId/assign
 */
export async function removeCourseFromPatient(patientId: RemoveCourseFromPatientPathParams["patientId"], courseId: RemoveCourseFromPatientPathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemoveCourseFromPatientMutationResponse>["data"]> {
    const res = await client<RemoveCourseFromPatientMutationResponse>({ method: "delete", url: `/api/patients/${patientId}/courses/${courseId}/assign`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}