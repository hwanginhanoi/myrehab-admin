import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetAllPlans1QueryResponse } from "../../types/GetAllPlans1";

 /**
 * @summary Get all plans
 * @link /api/plans
 */
export async function getAllPlans1(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllPlans1QueryResponse>["data"]> {
    const res = await client<GetAllPlans1QueryResponse>({ method: "get", url: `/api/plans`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}