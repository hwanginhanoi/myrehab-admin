import client from "@/lib/api-client";
import type { ResponseConfig } from "@/lib/api-client";
import type { AddBalanceMutationRequest, AddBalanceMutationResponse } from "../../types/AddBalance";

 /**
 * @description Add money to user's balance
 * @summary Add balance
 * @link /api/balance/add
 */
export async function addBalance(data: AddBalanceMutationRequest, options: Partial<Parameters<typeof client>[0]> = {}): Promise<ResponseConfig<AddBalanceMutationResponse>["data"]> {
    const res = await client<AddBalanceMutationResponse, AddBalanceMutationRequest>({ method: "post", url: `/api/balance/add`, baseURL: "http://localhost:8080", data, ...options });
    return res.data;
}