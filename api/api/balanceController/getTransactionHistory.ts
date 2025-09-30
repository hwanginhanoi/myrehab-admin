import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { GetTransactionHistoryQueryResponse } from "../../types/GetTransactionHistory";

 /**
 * @description Get user's transaction history
 * @summary Get transaction history
 * @link /api/balance/transactions
 */
export async function getTransactionHistory(options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<GetTransactionHistoryQueryResponse>["data"]> {
    const res = await client<GetTransactionHistoryQueryResponse>({ method: "get", url: `/api/balance/transactions`, baseURL: "http://localhost:8080", ...options });
    return res.data;
}