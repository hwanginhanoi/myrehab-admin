import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetPlanById1QueryResponse, GetPlanById1PathParams } from "../../types/GetPlanById1";

 /**
 * @summary Get plan details by ID
 * @link /api/admin/plans/:id
 */
export async function getPlanById1(id: GetPlanById1PathParams["id"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPlanById1QueryResponse>["data"]> {
    const res = await client<GetPlanById1QueryResponse>({ method: "get", url: `/api/admin/plans/${id}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}