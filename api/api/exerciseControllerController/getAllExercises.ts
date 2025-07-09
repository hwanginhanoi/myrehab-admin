import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllExercisesQueryResponse } from "../../types/GetAllExercises";

 /**
 * @link /api/exercises
 */
export async function getAllExercises(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllExercisesQueryResponse>["data"]> {
    const res = await client<GetAllExercisesQueryResponse>({ method: "get", url: `/api/exercises`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}