import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AddExerciseToCourseMutationResponse, AddExerciseToCoursePathParams } from "../../types/AddExerciseToCourse";

 /**
 * @link /api/courses/:courseId/exercises/:exerciseId
 */
export async function addExerciseToCourse(courseId: AddExerciseToCoursePathParams["courseId"], exerciseId: AddExerciseToCoursePathParams["exerciseId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AddExerciseToCourseMutationResponse>["data"]> {
    const res = await client<AddExerciseToCourseMutationResponse>({ method: "post", url: `/api/courses/${courseId}/exercises/${exerciseId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}