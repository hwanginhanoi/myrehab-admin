import client from "axios";
import type { ResponseConfig } from "axios";
import type { CreatePlanMutationRequest, CreatePlanMutationResponse } from "../../types/CreatePlan";

 /**
 * @summary Create a new plan
 * @link /api/admin/plans
 */
export async function createPlan(data: CreatePlanMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<CreatePlanMutationResponse>["data"]> {
    const res = await client<CreatePlanMutationResponse, CreatePlanMutationRequest>({ method: "post", url: `/api/admin/plans`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}