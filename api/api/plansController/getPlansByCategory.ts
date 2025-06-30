import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetPlansByCategoryQueryResponse, GetPlansByCategoryPathParams } from "../../types/GetPlansByCategory";

 /**
 * @summary Get plans by category
 * @link /api/plans/category/:category
 */
export async function getPlansByCategory(category: GetPlansByCategoryPathParams["category"], options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetPlansByCategoryQueryResponse>["data"]> {
    const res = await client<GetPlansByCategoryQueryResponse>({ method: "get", url: `/api/plans/category/${category}`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}