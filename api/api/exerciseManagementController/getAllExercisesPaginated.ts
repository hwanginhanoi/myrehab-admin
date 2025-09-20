import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllExercisesPaginatedQueryResponse, GetAllExercisesPaginatedQueryParams } from "../../types/GetAllExercisesPaginated";

 /**
 * @description Retrieve a paginated list of active exercises
 * @summary Get paginated exercises
 * @link /api/exercises/paginated
 */
export async function getAllExercisesPaginated(params?: GetAllExercisesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllExercisesPaginatedQueryResponse>["data"]> {
    const res = await client<GetAllExercisesPaginatedQueryResponse>({ method: "get", url: `/api/exercises/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}