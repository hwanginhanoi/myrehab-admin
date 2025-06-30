import client from "axios";
import type { ResponseConfig } from "axios";
import type { DeleteExerciseMutationResponse, DeleteExercisePathParams } from "../../types/DeleteExercise";

 /**
 * @summary Delete an exercise
 * @link /api/admin/exercises/:id
 */
export async function deleteExercise(id: DeleteExercisePathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<DeleteExerciseMutationResponse>["data"]> {
    const res = await client<DeleteExerciseMutationResponse>({ method: "delete", url: `/api/admin/exercises/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}