import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AddCategoryToExerciseMutationResponse, AddCategoryToExercisePathParams } from "../../types/AddCategoryToExercise";

 /**
 * @link /api/exercises/:exerciseId/categories/:categoryId
 */
export async function addCategoryToExercise(exerciseId: AddCategoryToExercisePathParams["exerciseId"], categoryId: AddCategoryToExercisePathParams["categoryId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AddCategoryToExerciseMutationResponse>["data"]> {
    const res = await client<AddCategoryToExerciseMutationResponse>({ method: "post", url: `/api/exercises/${exerciseId}/categories/${categoryId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}