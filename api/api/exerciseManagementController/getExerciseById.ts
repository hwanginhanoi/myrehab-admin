import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetExerciseByIdQueryResponse, GetExerciseByIdPathParams } from "../../types/GetExerciseById";

 /**
 * @description Retrieve a specific exercise by its ID
 * @summary Get exercise by ID
 * @link /api/exercises/:id
 */
export async function getExerciseById(id: GetExerciseByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetExerciseByIdQueryResponse>["data"]> {
    const res = await client<GetExerciseByIdQueryResponse>({ method: "get", url: `/api/exercises/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}