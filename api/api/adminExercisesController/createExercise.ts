import client from "axios";
import type { ResponseConfig } from "axios";
import type { CreateExerciseMutationRequest, CreateExerciseMutationResponse } from "../../types/CreateExercise";

 /**
 * @summary Create a new exercise
 * @link /api/admin/exercises
 */
export async function createExercise(data: CreateExerciseMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateExerciseMutationResponse>["data"]> {
    const res = await client<CreateExerciseMutationResponse, CreateExerciseMutationRequest>({ method: "post", url: `/api/admin/exercises`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}