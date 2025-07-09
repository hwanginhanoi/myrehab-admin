import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemoveExerciseFromCourseMutationResponse, RemoveExerciseFromCoursePathParams } from "../../types/RemoveExerciseFromCourse";

 /**
 * @link /api/courses/:courseId/exercises/:exerciseId
 */
export async function removeExerciseFromCourse(courseId: RemoveExerciseFromCoursePathParams["courseId"], exerciseId: RemoveExerciseFromCoursePathParams["exerciseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemoveExerciseFromCourseMutationResponse>["data"]> {
    const res = await client<RemoveExerciseFromCourseMutationResponse>({ method: "delete", url: `/api/courses/${courseId}/exercises/${exerciseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}