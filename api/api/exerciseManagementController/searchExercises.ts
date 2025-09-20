import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { SearchExercisesQueryResponse, SearchExercisesQueryParams } from "../../types/SearchExercises";

 /**
 * @description Search exercises by keyword in title
 * @summary Search exercises
 * @link /api/exercises/search
 */
export async function searchExercises(params: SearchExercisesQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<SearchExercisesQueryResponse>["data"]> {
    const res = await client<SearchExercisesQueryResponse>({ method: "get", url: `/api/exercises/search`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}