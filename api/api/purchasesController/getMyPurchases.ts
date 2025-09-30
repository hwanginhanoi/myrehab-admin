import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetMyPurchasesQueryResponse } from "../../types/GetMyPurchases";

 /**
 * @description Get current user's purchase history
 * @summary Get my purchases
 * @link /api/purchases
 */
export async function getMyPurchases(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetMyPurchasesQueryResponse>["data"]> {
    const res = await client<GetMyPurchasesQueryResponse>({ method: "get", url: `/api/purchases`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}