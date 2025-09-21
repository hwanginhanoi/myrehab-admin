import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { UpdateExerciseMutationRequest, UpdateExerciseMutationResponse, UpdateExercisePathParams } from "../../types/UpdateExercise";

 /**
 * @description Update an existing rehabilitation exercise (Admin and Doctor only)
 * @summary Update exercise
 * @link /api/exercises/:id
 */
export async function updateExercise(id: UpdateExercisePathParams["id"], data: UpdateExerciseMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<UpdateExerciseMutationResponse>["data"]> {
    const res = await client<UpdateExerciseMutationResponse, UpdateExerciseMutationRequest>({ method: "put", url: `/api/exercises/${id}`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}