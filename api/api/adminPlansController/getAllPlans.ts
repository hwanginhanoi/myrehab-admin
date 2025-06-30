import client from "axios";
import type { ResponseConfig } from "axios";
import type { GetAllPlansQueryResponse } from "../../types/GetAllPlans";

 /**
 * @summary Get all plans (admin view)
 * @link /api/admin/plans
 */
export async function getAllPlans(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetAllPlansQueryResponse>["data"]> {
    const res = await client<GetAllPlansQueryResponse>({ method: "get", url: `/api/admin/plans`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}