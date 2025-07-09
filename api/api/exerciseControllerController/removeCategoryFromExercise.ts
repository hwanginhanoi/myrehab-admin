import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { RemoveCategoryFromExerciseMutationResponse, RemoveCategoryFromExercisePathParams } from "../../types/RemoveCategoryFromExercise";

 /**
 * @link /api/exercises/:exerciseId/categories/:categoryId
 */
export async function removeCategoryFromExercise(exerciseId: RemoveCategoryFromExercisePathParams["exerciseId"], categoryId: RemoveCategoryFromExercisePathParams["categoryId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<RemoveCategoryFromExerciseMutationResponse>["data"]> {
    const res = await client<RemoveCategoryFromExerciseMutationResponse>({ method: "delete", url: `/api/exercises/${exerciseId}/categories/${categoryId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}