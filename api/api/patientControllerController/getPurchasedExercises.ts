import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetPurchasedExercisesQueryResponse, GetPurchasedExercisesPathParams } from "../../types/GetPurchasedExercises";

 /**
 * @link /api/patients/:patientId/exercises/purchased
 */
export async function getPurchasedExercises(patientId: GetPurchasedExercisesPathParams["patientId"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPurchasedExercisesQueryResponse>["data"]> {
    const res = await client<GetPurchasedExercisesQueryResponse>({ method: "get", url: `/api/patients/${patientId}/exercises/purchased`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}