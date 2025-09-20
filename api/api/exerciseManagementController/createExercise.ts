import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { CreateExerciseMutationRequest, CreateExerciseMutationResponse } from "../../types/CreateExercise";

 /**
 * @description Create a new rehabilitation exercise (Admin and Doctor only)
 * @summary Create new exercise
 * @link /api/exercises
 */
export async function createExercise(data: CreateExerciseMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreateExerciseMutationResponse>["data"]> {
    const res = await client<CreateExerciseMutationResponse, CreateExerciseMutationRequest>({ method: "post", url: `/api/exercises`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}