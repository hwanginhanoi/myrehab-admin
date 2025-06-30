import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetExerciseByIdQueryResponse, GetExerciseByIdPathParams } from "../../types/GetExerciseById";

 /**
 * @summary Get exercise by ID
 * @link /api/admin/exercises/:id
 */
export async function getExerciseById(id: GetExerciseByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetExerciseByIdQueryResponse>["data"]> {
    const res = await client<GetExerciseByIdQueryResponse>({ method: "get", url: `/api/admin/exercises/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}