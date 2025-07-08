import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemoveCourseFromPatientMutationResponse, RemoveCourseFromPatientPathParams } from "../../types/RemoveCourseFromPatient";

 /**
 * @description Removes an assigned course from a patient
 * @summary Remove course from patient
 * @link /api/admin/patients/:patientId/remove-course/:courseId
 */
export async function removeCourseFromPatient(patientId: RemoveCourseFromPatientPathParams["patientId"], courseId: RemoveCourseFromPatientPathParams["courseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemoveCourseFromPatientMutationResponse>["data"]> {
    const res = await client<RemoveCourseFromPatientMutationResponse>({ method: "delete", url: `/api/admin/patients/${patientId}/remove-course/${courseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}