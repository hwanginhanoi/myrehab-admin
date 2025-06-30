import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetAllExercisesQueryResponse } from "../../types/GetAllExercises";

 /**
 * @summary Get all exercises
 * @link /api/admin/exercises
 */
export async function getAllExercises(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllExercisesQueryResponse>["data"]> {
    const res = await client<GetAllExercisesQueryResponse>({ method: "get", url: `/api/admin/exercises`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}