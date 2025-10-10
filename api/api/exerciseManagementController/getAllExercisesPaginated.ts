import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetAllExercisesPaginatedQueryResponse, GetAllExercisesPaginatedQueryParams } from "../../types/GetAllExercisesPaginated";

 /**
 * @description Retrieve a paginated list of exercises with optional category and search filtering. Use query params: ?categoryId=1&keyword=search&page=0&size=10&sort=createdAt,desc
 * @summary Get paginated exercises with filtering
 * @link /api/exercises/paginated
 */
export async function getAllExercisesPaginated(params: GetAllExercisesPaginatedQueryParams, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllExercisesPaginatedQueryResponse>["data"]> {
    const res = await client<GetAllExercisesPaginatedQueryResponse>({ method: "get", url: `/api/exercises/paginated`, baseURL: "http://localhost:8080", params, ...options });
    return res.data;
}