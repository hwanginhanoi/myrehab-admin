import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetPlanByIdQueryResponse, GetPlanByIdPathParams } from "../../types/GetPlanById";

 /**
 * @summary Get plan details by ID
 * @link /api/plans/:id
 */
export async function getPlanById(id: GetPlanByIdPathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPlanByIdQueryResponse>["data"]> {
    const res = await client<GetPlanByIdQueryResponse>({ method: "get", url: `/api/plans/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}