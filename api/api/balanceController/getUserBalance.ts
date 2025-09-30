import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetUserBalanceQueryResponse } from "../../types/GetUserBalance";

 /**
 * @description Get current user's balance
 * @summary Get user balance
 * @link /api/balance
 */
export async function getUserBalance(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetUserBalanceQueryResponse>["data"]> {
    const res = await client<GetUserBalanceQueryResponse>({ method: "get", url: `/api/balance`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}