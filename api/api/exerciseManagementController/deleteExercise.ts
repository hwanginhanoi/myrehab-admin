import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { DeleteExerciseMutationResponse, DeleteExercisePathParams } from "../../types/DeleteExercise";

 /**
 * @description Soft delete an exercise by setting it as inactive (Admin and Doctor only)
 * @summary Delete exercise
 * @link /api/exercises/:id
 */
export async function deleteExercise(id: DeleteExercisePathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteExerciseMutationResponse>["data"]> {
    const res = await client<DeleteExerciseMutationResponse>({ method: "delete", url: `/api/exercises/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}