import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetExercisesByCategoryQueryResponse, GetExercisesByCategoryPathParams } from "../../types/GetExercisesByCategory";

 /**
 * @link /api/exercises/category/:categoryId
 */
export async function getExercisesByCategory(categoryId: GetExercisesByCategoryPathParams["categoryId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetExercisesByCategoryQueryResponse>["data"]> {
    const res = await client<GetExercisesByCategoryQueryResponse>({ method: "get", url: `/api/exercises/category/${categoryId}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}